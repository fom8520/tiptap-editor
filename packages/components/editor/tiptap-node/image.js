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
        var _a, _b, _c, _d, _e;
        const onError = (e) => {
            var _a, _b, _c;
            const image = (_a = e.target) !== null && _a !== void 0 ? _a : (_c = (_b = e) === null || _b === void 0 ? void 0 : _b.path) === null || _c === void 0 ? void 0 : _c[0];
            // const errorUrl = require("../../../assets/imageError.svg");
            image.classList.remove("image-loading");
            image.classList.add("image-error");
            // image.src = errorUrl;
        };
        const onImageLoading = (e) => {
            var _a, _b, _c, _d, _e, _f;
            const image = (_a = e.target) !== null && _a !== void 0 ? _a : (_c = (_b = e) === null || _b === void 0 ? void 0 : _b.path) === null || _c === void 0 ? void 0 : _c[0];
            (_e = (_d = image === null || image === void 0 ? void 0 : image.classList) === null || _d === void 0 ? void 0 : _d.remove) === null || _e === void 0 ? void 0 : _e.call(_d, "image-loading");
            (_f = image === null || image === void 0 ? void 0 : image.classList) === null || _f === void 0 ? void 0 : _f.add("image-success");
        };
        const img = document.createElement("img");
        const images = mergeAttributes(HTMLAttributes, this.options.HTMLAttributes);
        for (const k in images) {
            if (!images[k])
                continue;
            img[k] = images[k];
        }
        const imageClassName = (_a = img === null || img === void 0 ? void 0 : img.classList.toString().split(" ")) !== null && _a !== void 0 ? _a : [];
        if (!(imageClassName.includes("image-loading") ||
            imageClassName.includes("image-error") ||
            imageClassName.includes("image-success"))) {
            img === null || img === void 0 ? void 0 : img.classList.add("image-loading");
        }
        (_b = img === null || img === void 0 ? void 0 : img.removeEventListener) === null || _b === void 0 ? void 0 : _b.call(img, "error", onError);
        (_c = img === null || img === void 0 ? void 0 : img.addEventListener) === null || _c === void 0 ? void 0 : _c.call(img, "error", onError);
        (_d = img === null || img === void 0 ? void 0 : img.removeEventListener) === null || _d === void 0 ? void 0 : _d.call(img, "load", onImageLoading);
        (_e = img === null || img === void 0 ? void 0 : img.addEventListener) === null || _e === void 0 ? void 0 : _e.call(img, "load", onImageLoading);
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