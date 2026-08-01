import { createLazyFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";

const RouteComponent = () => {
  const { isAuthenticated, isSuccess } = useAuth();

  return isAuthenticated && isSuccess ? (
    <Navigate to="/feeds" />
  ) : (
    <>
      <h1>What if someone made, like, a worse RSS app?</h1>
      <p>
        You know what the world doesn't need? Another RSS app. But I made one anyway. Why? Maybe I'm
        bored. Maybe because I hate all the other RSS apps I've used for one reason or another.
      </p>
      <p>Maybe I'm a glutton for punishment.</p>
      <p>Who can say? Check it out if you want, I'm not your boss.</p>
      <p>
        <a href="http://localhost:3000/api/auth/login">Login</a>
      </p>
    </>
  );
};

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});
