import { visit } from 'unist-util-visit'
import { parse } from 'node-html-parser'

export default function rehypeCodeBlockEnhancer() {
    return function(tree) {
        visit(
            tree,
            node => node.type === "raw" && (node as any).value.startsWith("<pre class="),
            (node) => {
                const root = parse(node.value, { blockTextElements: { pre: true } }) as any;
                const language = new RegExp(/class="language-(?<lang>.+)"/gm).exec(root.firstChild.rawAttrs)?.groups?.lang;
                const langTag = `<aside class="language-tag">${language}</aside>`;
                root.firstChild.innerHTML = `${root.firstChild.innerHTML}${langTag}`;

                const newNode = Object.assign(node, {});
                newNode.value = root.toString();
                return newNode;
            })
    };
}
