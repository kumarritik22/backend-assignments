import { RouterProvider } from "react-router-dom"
import { router } from "./app.routes"
import { AuthProvider } from "./features/auth/auth.context";
import "./features/shared/global.scss"
import { PostContextProvider } from "./features/posts/post.context";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <PostContextProvider>
          <RouterProvider router={router} />
        </PostContextProvider>
      </AuthProvider>
    </div>
  )
}

export default App
