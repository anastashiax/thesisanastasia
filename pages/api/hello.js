// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sanityClient } from "../../sanity"

sanityClient.config({
  token: process.env.SANITY_WRITE_TOKEN,
});