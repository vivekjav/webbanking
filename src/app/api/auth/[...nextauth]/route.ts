import NextAuth from 'next-auth';
import { authOptions } from './auth.config';

// Create handler from imported authOptions
const handler = NextAuth(authOptions);

// Export GET and POST handlers
export { handler as GET, handler as POST }; 