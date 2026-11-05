import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** 文章分类：路由 slug → 中文标签 */
export const CATEGORIES = {
  paper: 'Paper Reading',
  chat: 'Random Chat',
  tech: 'Model Technology',
} as const;

export type CategorySlug = keyof typeof CATEGORIES;

/** 文章所在目录名 → 分类 slug */
const DIR_TO_SLUG: Record<string, CategorySlug> = {
  paper_reading: 'paper',
  random_chat: 'chat',
  model_tech: 'tech',
};

/** 文章的分类 slug，由其所在目录推断 */
export function categoryOf(post: Post): CategorySlug {
  const dir = post.id.split('/').slice(0, -1).join('/');
  const slug = DIR_TO_SLUG[dir];
  if (!slug) throw new Error(`未知分类目录：${dir}（post id=${post.id}）`);
  return slug;
}

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

/** 文章 URL slug：使用文件名（忽略分类子目录，保证是单段路径） */
export function postSlug(post: Post): string {
  return post.id.split('/').pop()!;
}

/** 文章 URL，可附带分类 query param 以支持分类内上下篇切换 */
export function postUrl(post: Post): string {
  const base = `${import.meta.env.BASE_URL}post/${postSlug(post)}`;
  return base;
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
