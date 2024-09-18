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

const Signup = () => {
  return (
    <div>
      <NavBar />
      <div className="h-[90vh] flex flex-col justify-center items-center">
        <Card className={`w-[800px]`}>
          <CardHeader>
            <CardTitle className="text-2xl">Sign up</CardTitle>
            <CardDescription>Enjoy the services in one click</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex w-full items-start gap-4">
                <div className="w-full flex flex-col gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="Enter your username" />
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
                <div className="w-full flex flex-col gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="profile">Profile Picture</Label>
                    <Input id="profile" type="file" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="cover">Cover Picture</Label>
                    <Input id="cover" type="file" />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit">Submit</Button>
            <Link to="/login" className="ml-2">
              Already registered?
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

export default Signup;
