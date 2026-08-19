import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";

export async function getCartDetails(userId) {
    let cart = (await cartModel.aggregate([
        {
        $match: {
            user: new mongoose.Types.ObjectId(userId)
        }
        },
        { $unwind: { path: '$items' } },
        {
        $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'items.product'
        }
        },
        { $unwind: { path: '$items.product' } },
        {
        $unwind: { path: '$items.product.variants' }
        },
        {
        $match: {
            $expr: {
            $eq: [
                '$items.variant',
                '$items.product.variants._id'
            ]
            }
        }
        },
        {
        $addFields: {
            'items.itemTotal': {
            amount: {
                $multiply: [
                '$items.quantity',
                '$items.product.variants.price.amount'
                ]
            },
            currency: '$items.product.variants.price.currency'
            }
        }
        },
        {
        $group: {
            _id: '$_id',
            items: { $push: '$items' },
            rawTotals: {
            $push: {
                currency: '$items.product.variants.price.currency',
                amount: {
                $multiply: [
                    '$items.quantity',
                    '$items.product.variants.price.amount'
                ]
                }
            }
            }
        }
        },
        {
        $addFields: {
            totalsByCurrency: {
            $reduce: {
                input: '$rawTotals',
                initialValue: [],
                in: {
                $let: {
                    vars: {
                    idx: { $indexOfArray: ['$$value.currency', '$$this.currency'] }
                    },
                    in: {
                    $cond: {
                        if: { $eq: ['$$idx', -1] },
                        then: {
                        $concatArrays: [
                            '$$value',
                            [{ currency: '$$this.currency', amount: '$$this.amount' }]
                        ]
                        },
                        else: {
                        $map: {
                            input: '$$value',
                            as: 'entry',
                            in: {
                            $cond: {
                                if: { $eq: ['$$entry.currency', '$$this.currency'] },
                                then: {
                                currency: '$$entry.currency',
                                amount: { $add: ['$$entry.amount', '$$this.amount'] }
                                },
                                else: '$$entry'
                            }
                            }
                        }
                        }
                    }
                    }
                }
            }
            }
        }
        }},
        { $project: { rawTotals: 0 } }
    ]))[0]

    return cart;
}