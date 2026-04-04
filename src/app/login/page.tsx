import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Innskráning</h1>
        <p>Skráðu þig inn til að fá aðgang að admin svæðinu.</p>
        <LoginForm />
      </div>
    </section>
  );
}