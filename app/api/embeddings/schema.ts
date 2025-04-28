import { z } from "zod";

const schema = z.object({
  markdown: z.string(),
});

export default schema;
