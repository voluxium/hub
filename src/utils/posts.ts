import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** 文章分类：路由 slug → 中文标签 */
export const CATEGORIES = {
  paper: '论文阅读',
  chat: '随便聊聊',
} as const;

export type CategorySlug = keyof typeof CATEGORIES;

/** 按日期降序排序的文章列表 */
export function sortedPosts(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
}

/** 把日期格式化成 YYYY-MM-DD */
export function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 文章 URL slug：YYMMDD 六位数 */
export function postSlug(post: Post): string {
  const d = post.data.date;
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

/** 文章 URL */
export function postUrl(post: Post): string {
  return `${import.meta.env.BASE_URL}post/${postSlug(post)}`;
}

/**
 * 从 markdown body 中提取首段纯文本，作为列表摘要。
 * 优先使用 frontmatter.excerpt，否则取正文第一段并剥离 markdown 语法。
 */
export function postExcerpt(post: Post): string {
  if (post.data.excerpt) return post.data.excerpt;
  const body = post.body ?? '';
  const firstPara = body
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .find((s) => s.length > 0 && !/^#/.test(s) && !/^!/.test(s));
  if (!firstPara) return '';
  return firstPara
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
