import Layout from "shared-lib/src/_webapp/Layout.svelte";

function render() {
    const target = document.getElementById("app");
    if (target) {
        new Layout({
            target
        });
    }
}

document.addEventListener("DOMContentLoaded", render);