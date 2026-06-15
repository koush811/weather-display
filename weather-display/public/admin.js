(function () {
    function qs(sel, root = document) {
        return root.querySelector(sel);
    }

    const loginView = qs("#loginView");
    const panel = qs("#panel");

    const pageTokenEl = qs("#pageToken");
    const loginBtn = qs("#loginBtn");

    const fileInput = qs('input[type="file"]');
    const sendBtn = qs("#sendBtn");
    const resultEl = qs("#result");

    let adminToken = "";

    function showLogin() {
        loginView.style.display = "block";
        panel.style.display = "none";
    }

    function showPanel() {
        loginView.style.display = "none";
        panel.style.display = "block";
    }

    async function checkPageToken(token) {
        try {
            const res = await fetch("/api/admin", {
                method: "POST",
                headers: {
                    "x-adminpage-token": token,
                },
            });

            return res.status === 200;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async function uploadFile(file) {
        return fetch("/api/upload", {
            method: "POST",
            headers: {
                "Content-Type": file.type,
                "x-adminpage-token": adminToken,
                "x-file-name": encodeURIComponent(file.name),
            },
            body: file,
        });
    }

    loginBtn.addEventListener("click", async function () {
        const token = pageTokenEl.value.trim();

        loginBtn.disabled = true;
        loginBtn.textContent = "検証中...";

        const ok = await checkPageToken(token);

        loginBtn.disabled = false;
        loginBtn.textContent = "ログイン";

        if (ok) {
            adminToken = token;
            showPanel();
        } else {
            alert("パスワードが違います");
        }
    });

    sendBtn.addEventListener("click", async function () {
        const file = fileInput.files[0];

        if (!file) {
            alert("ファイルを選択してください");
            return;
        }

        sendBtn.disabled = true;
        sendBtn.textContent = "アップロード中...";
        resultEl.textContent = "";

        try {
            const res = await uploadFile(file);

            const data = await res.json();

            if (res.ok) {
                console.log("upload success", data);

                resultEl.textContent =
                    "アップロード完了 : " + file.name;
            } else {
                console.error(data);

                resultEl.textContent =
                    "エラー : " + (data.error || res.status);
            }
        } catch (e) {
            console.error(e);
            resultEl.textContent = "アップロード失敗";
        }

        sendBtn.disabled = false;
        sendBtn.textContent = "アップロード";
    });

    fileInput.addEventListener("change", function () {
        sendBtn.disabled = !fileInput.files.length;
    });

    showLogin();
})();