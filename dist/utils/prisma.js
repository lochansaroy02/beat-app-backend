import { PrismaClient } from '@prisma/client';
let prisma;
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
}
else {
    // In development, use a global variable to prevent hot-reloading issues
    // and ensure only one instance is created.
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}
export default prisma;
//# sourceMappingURL=prisma.js.map