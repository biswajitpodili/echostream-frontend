import NavBar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div>
      <NavBar />
      <div className="h-[90vh] flex flex-col justify-center items-center">
        <Card className={`w-[450px]`}>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enjoy the services in one click</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex w-full items-start gap-4">
                <div className="w-full flex flex-col gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit">Submit</Button>
            <Link to="/signup" className="ml-2">
              new User?
            </Link>
          </CardFooter>
        </Card>

        {/* <h1 className="text-4xl font-bold">Signup</h1>
        <form className="flex flex-col gap-4 mt-4">
          <input
            type="text"
            placeholder="Username"
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="email"
            placeholder="Email"
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 border border-gray-300 rounded-md"
          />
          <button className="bg-red-400 text-white p-2 rounded-md">
            Signup
          </button>
        </form> */}
      </div>
    </div>
  );
};

export default Login;
