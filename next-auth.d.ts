import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      image: string;
      githubLogin: string;
      accessToken: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    githubLogin: string;
    accessToken: string;
    userName: string;
    userEmail: string;
    userImage: string;
  }
}
