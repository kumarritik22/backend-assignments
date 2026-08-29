
const Footer = () => {
  return (
    <div className="main">
        <div>
            <h2>The Velora Circle</h2>
            <p>Subscribe for early access to limited collections, private edits, and seasonal drops.</p>
            <form>
                <input type="email" name="email" value={email} placeholder="Email Address" />
                <button>SUBSCRIBE</button>
            </form>
        </div>
    </div>
  )
}

export default Footer
