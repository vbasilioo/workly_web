import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authService } from "@/lib/services/auth";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials): Promise<User | null> {
                if (!credentials) return null;

                try {
                    const res = await authService.login({
                        email: credentials.email,
                        password: credentials.password,
                    });

                    const user: User = {
                        id: res.data.user.id,
                        email: res.data.user.email,
                        token: res.data.access_token,
                        role: res.data.user.role,
                        name: res.data.user.name,
                    };

                    return user;
                } catch (err) {
                    console.error("Erro no login:", err);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.token;
                token.id = user.id;
                token.role = user.role;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            session.token = token.accessToken as string;

            session.user = {
                id: token.id as string,
                name: token.name as string,
                email: token.email as string,
                role: token.role as "administrator" | "user",
            };

            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
