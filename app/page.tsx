import TodoApp from "../components/TodoApp";
import AuthGuard from "../components/auth/AuthGuard";
import Header from "../components/Header";

export default function Home() {
  return (
    <AuthGuard>
      <Header />
      <TodoApp />
    </AuthGuard>
  );
}
