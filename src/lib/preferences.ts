"use client";

import type { AgentId } from "@/types/template";
import { createLocalStore } from "@/lib/client-store";
import { storageKeys } from "@/lib/storage";

/**
 * Shared preference stores.
 *
 * These must be module singletons: the prompt tabs and the header actions both
 * read the selected agent, and creating a store per component would give each
 * its own cache and listeners, so switching tabs would not update the header.
 */
export const agentStore = createLocalStore<AgentId>(storageKeys.agent, "claude-code");
