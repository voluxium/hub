/**
 * rehype 插件：把独占一段的图片 ![说明](src) 转成
 * <figure><img /><figcaption>说明</figcaption></figure>
 * 无说明的图片保持原样。
 */
export function rehypeFigureCaption() {
  return (tree) => {
    const walk = (node) => {
      if (!node?.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (!child) continue;
        const isSoloImg =
          child.type === 'element' &&
          child.tagName === 'p' &&
          child.children.length === 1 &&
          child.children[0].type === 'element' &&
          child.children[0].tagName === 'img';
        if (isSoloImg) {
          const img = child.children[0];
          const alt = typeof img.properties?.alt === 'string' ? img.properties.alt : '';
          if (alt.trim()) {
            node.children[i] = {
              type: 'element',
              tagName: 'figure',
              properties: {},
              children: [
                img,
                {
                  type: 'element',
                  tagName: 'figcaption',
                  properties: {},
                  children: [{ type: 'text', value: alt }],
                },
              ],
            };
          }
        }
        walk(child);
      }
    };
    walk(tree);
  };
}
