const GITHUB_API = "https://api.github.com";

function githubConfig() {
  const token = process.env.GITHUB_TOKEN?.trim();
  const repo = process.env.GITHUB_REPO?.trim();
  if (!token || !repo) return null;
  return { token, repo };
}

function cmsPath(filename: string) {
  return `data/cms/${filename}`;
}

export function canUseGithubCms(): boolean {
  return githubConfig() !== null;
}

export async function readGithubJson<T>(filename: string): Promise<T | null> {
  const cfg = githubConfig();
  if (!cfg) return null;

  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${cfg.repo}/contents/${cmsPath(filename)}`,
      {
        headers: {
          Authorization: `Bearer ${cfg.token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: { revalidate: 0 },
      }
    );
    if (!res.ok) return null;
    const payload = (await res.json()) as { content?: string; encoding?: string };
    if (!payload.content || payload.encoding !== "base64") return null;
    const raw = Buffer.from(payload.content.replace(/\n/g, ""), "base64").toString("utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function writeGithubJson<T>(filename: string, data: T): Promise<void> {
  const cfg = githubConfig();
  if (!cfg) {
    throw new Error("GITHUB_TOKEN and GITHUB_REPO are not configured");
  }

  const path = cmsPath(filename);
  const body = JSON.stringify(data, null, 2) + "\n";
  const message = `cms: update ${filename}`;

  let sha: string | undefined;
  const existing = await fetch(`${GITHUB_API}/repos/${cfg.repo}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (existing.ok) {
    const meta = (await existing.json()) as { sha?: string };
    sha = meta.sha;
  }

  const res = await fetch(`${GITHUB_API}/repos/${cfg.repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(body, "utf8").toString("base64"),
      sha,
    }),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? `GitHub save failed (${res.status})`);
  }
}