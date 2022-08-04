import { mergeAttributes, Node, nodeInputRule } from "@tiptap/core";
export const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;
export const Image = Node.create({
    name: "image",
    addOptions() {
        return {
            inline: false,
            allowBase64: false,
            HTMLAttributes: {},
            style: "",
        };
    },
    inline() {
        return this.options.inline;
    },
    group() {
        return this.options.inline ? "inline" : "block";
    },
    draggable: true,
    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: this.options.allowBase64
                    ? "img[src]"
                    : 'img[src]:not([src^="data:"])',
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        const onError = (e) => {
            const image = e.target ?? e?.path?.[0];
            const errorUrl = require("../../assets/imageError.svg");
            image.classList.add("image-error");
            image.src = errorUrl;
        };
        const onImageLoading = (e) => {
            const image = e.target ?? e?.path?.[0];
            image?.classList?.remove?.("image-loading");
            image?.classList?.add("image-success");
        };
        const img = document.createElement("img");
        const images = mergeAttributes(HTMLAttributes, this.options.HTMLAttributes);
        for (const k in images) {
            if (!images[k])
                continue;
            img[k] = images[k];
        }
        const imageClassName = img?.classList.toString().split(" ") ?? [];
        if (!(imageClassName.includes("image-loading") ||
            imageClassName.includes("image-error") ||
            imageClassName.includes("image-success"))) {
            img?.classList.add("image-loading");
        }
        img?.removeEventListener?.("error", onError);
        img?.addEventListener?.("error", onError);
        img?.removeEventListener?.("load", onImageLoading);
        img?.addEventListener?.("load", onImageLoading);
        const el = document.createElement("div");
        const els = mergeAttributes({
            classList: ["editor-image"],
            style: this.options.style,
        });
        el.appendChild(img);
        for (const k in els) {
            if (!els[k])
                continue;
            el[k] = els[k];
        }
        return el;
    },
    addCommands() {
        return {
            setImage: (options) => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: options,
                });
            },
        };
    },
    addInputRules() {
        return [
            nodeInputRule({
                find: inputRegex,
                type: this.type,
                getAttributes: (match) => {
                    const [, , alt, src, title] = match;
                    return { src, alt, title };
                },
            }),
        ];
    },
});
export default Image;
//# sourceMappingURL=image.js.map