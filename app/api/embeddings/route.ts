import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import schema from "./schema";

function checkAuth(req: NextRequest) {
  const authKey = req.headers.get("Authorization");
  if (!authKey || authKey !== process.env.AUTH_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function POST(req: NextRequest) {
  const authResponse = checkAuth(req);
  if (authResponse) return authResponse;

  try {
    // Read the body only once
    const rawBody = await req.text();

    // Try to parse as JSON first
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch {
      // If parsing fails, treat the entire content as markdown
      body = { markdown: rawBody };
    }

    const validation = schema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-small",
    });

    const { markdown } = validation.data;

    const mdSplitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const mdDocs = await mdSplitter.createDocuments([markdown]);

    const supabaseClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const vectorStore = new SupabaseVectorStore(embeddings, {
      client: supabaseClient,
      tableName: "documents",
      queryName: "match_documents",
    });

    const result = await vectorStore.addDocuments(mdDocs);

    return NextResponse.json({ result: result }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process markdown content" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const authResponse = checkAuth(req);
  if (authResponse) return authResponse;

  const supabaseClient = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-small",
    });

    const vectorStore = new SupabaseVectorStore(embeddings, {
      client: supabaseClient,
      tableName: "documents",
      queryName: "match_documents",
    });

    // get ids from the request path
    // suppose single value stands for a single id, e.g 1
    // multiple values is represented with a dash for a range, e.g 1-3
    const ids = req.nextUrl.searchParams.get("ids");

    if (!ids) {
      return NextResponse.json({ error: "No ids provided" }, { status: 400 });
    }

    const idsArray = ids.split("-");
    let expandedIds: number[] = [];

    if (idsArray.length === 1) {
      expandedIds = [parseInt(idsArray[0])];
    } else {
      const start = parseInt(idsArray[0]);
      const end = parseInt(idsArray[1]);
      expandedIds = Array.from(
        { length: end - start + 1 },
        (_, i) => start + i
      );
    }

    await vectorStore.delete({ ids: expandedIds });

    return NextResponse.json(
      { result: "Documents embeddings deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete documents embeddings" },
      { status: 500 }
    );
  }
}
