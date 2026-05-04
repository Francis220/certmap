import type { CertChange } from "@/lib/types";
import raw from "./changes.json";

export const CHANGES: CertChange[] = raw as CertChange[];
