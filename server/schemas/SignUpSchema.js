import { z } from "zod";

const SignUpSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.email().max(255),
  password: z.string().min(8).max(100)
})

export default SignUpSchema;