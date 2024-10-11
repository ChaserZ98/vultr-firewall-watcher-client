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
    for (const test of tests) {
        if (eval(test) === undefined) {
            throw new CompatibilityError(
                `Your browser/webview does not support ${test}. Please update your browser/webview and try again.`
            );
        }
    }
}
