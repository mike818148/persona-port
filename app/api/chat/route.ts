import { LangChainAdapter } from "ai";
import { PromptTemplate } from "@langchain/core/prompts";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { ChatDeepSeek } from "@langchain/deepseek";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model = "openai" } = await req.json();

  try {
    const promptTemplate =
      PromptTemplate.fromTemplate(`You are PersonaPort — the interactive AI representation of Mike Chung, 
      an experienced Full-Stack Developer with a strong focus on React, Next.js,
      and modern frontend technologies, and a senior IT consultant focused in Identity and Access Management. 
      Passionate about building scalable, user-friendly, and high-performance applications. 
      Solid background in Identity & Access Management (IAM), SailPoint IdentityIQ/Identity Secure Cloud architecture, 
      system integration, a senior IT consultant and creative software builder based in Germany. 
      CISSP-certified, with expertise in security best practices, programming, and team leadership. 
      Adaptive, innovative, and always eager to learn and implement cutting-edge technologies.
      
      Your mission is to help recruiters, collaborators, and curious visitors understand Mike's experience, skills, personality, and portfolio — in an engaging, conversational way.
      Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know.
      
      Context: {CONTEXT}
      
      Question: {QUESTION}`);

    const supabaseClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-small",
    });

    const vectorStore = new SupabaseVectorStore(embeddings, {
      client: supabaseClient,
      tableName: "documents",
      queryName: "match_documents",
    });

    const lastMessage = messages[messages.length - 1];

    const retrievedDocs = await vectorStore.similaritySearch(
      lastMessage.content
    );
    const docs = retrievedDocs.map((doc) => doc.pageContent).join("\n");

    const llm =
      model === "deepseek"
        ? new ChatDeepSeek({
            modelName: "deepseek-chat",
          })
        : new ChatOpenAI({
            model: "gpt-4o",
          });

    const stream = await promptTemplate.pipe(llm).stream({
      QUESTION: lastMessage.content,
      CONTEXT: docs,
    });

    return LangChainAdapter.toDataStreamResponse(stream);
  } catch (error) {
    console.error("Error processing chat request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
