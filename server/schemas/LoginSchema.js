import { z } from "zod";

const LoginSchema = z.object({
  email: z.email(),
  password: z.string()
});


export default LoginSchema;