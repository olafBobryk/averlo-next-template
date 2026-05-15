import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Media } from "@/payload/collections/Media";
import { Pages } from "@/payload/collections/Pages";
import { Users } from "@/payload/collections/Users";
import { SiteLayout } from "@/payload/globals/SiteLayout";
import { isPayloadConfigured } from "@/payload/isPayloadConfigured";

const fallbackDatabaseUrl =
	"postgres://payload-disabled:payload-disabled@localhost:5432/payload_disabled";

export default buildConfig({
	admin: {
		user: Users.slug,
	},
	collections: [Users, Pages, Media],
	db: postgresAdapter({
		pool: {
			connectionString: process.env.DATABASE_URL ?? fallbackDatabaseUrl,
		},
	}),
	editor: lexicalEditor(),
	globals: [SiteLayout],
	plugins: [
		vercelBlobStorage({
			enabled:
				isPayloadConfigured() && Boolean(process.env.BLOB_READ_WRITE_TOKEN),
			collections: {
				media: true,
			},
			token: process.env.BLOB_READ_WRITE_TOKEN,
		}),
	],
	secret: process.env.PAYLOAD_SECRET ?? "payload-disabled-local-secret",
	sharp,
});
