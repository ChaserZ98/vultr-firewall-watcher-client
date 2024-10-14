export default function checkCompatibility() {
    check([
        "AbortSignal",
        "AbortController",
        "AbortSignal.timeout",
        "AbortSignal.any",
    ]);
    check(["fetch"]);
    check(["Promise", "Promise.any"]);
}

class CompatibilityError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CompatibilityError";
    }
}

function check(tests: string[]) {
    const checked = new Set();
    for (const test of tests) {
        const parts = test.split(".");
        let cur: any = window;
        let allPart = parts[0];
        for (const part of parts) {
            if (!checked.has(allPart) && cur[part] === undefined)
                throw new CompatibilityError(
                    `Your browser/webview does not support ${test}. Please update your browser/webview and try again.`
                );

            checked.add(allPart);
            allPart += `.${part}`;
            cur = cur[part];
        }
    }
}
