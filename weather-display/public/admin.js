(function () {
    console.log("public/admin.js")
    function qs(sel, root = document) { return root.querySelector(sel); }

    const loginView = qs('#loginView');
    const panel = qs('#panel');
    const pageTokenEl = qs('#pageToken');
    const loginBtn = qs('#loginBtn');
    const sendTokenEl = qs('#sendToken');
    const sendBtn = qs('#sendBtn');
    const resultEl = qs('#result');

    function showLogin() {
        loginView.style.display = 'block';
        panel.style.display = 'none';
    }

    function showPanel() {
        loginView.style.display = 'none';
        panel.style.display = 'block';
    }

    async function checkPageToken(token) {
        try {
            const res = await fetch('/api/admin', { method: 'POST', headers: { 'x-adminpage-token': token } });
            return res.status === 200;
        } catch (e) {
            return false;
        }
    }

    async function sendAlert(alertType, token) {
        try {
            const res = await fetch('/api/alert', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-admin-token': token,
                },
                body: JSON.stringify({ level: alertType }),
            });
            return res;
        } catch (e) {
            throw e;
        }
    }

    loginBtn.addEventListener('click', async function () {
        const token = pageTokenEl.value.trim();
        loginBtn.disabled = true;
        loginBtn.textContent = '検証中...';
        const ok = await checkPageToken(token);
        loginBtn.disabled = false;
        loginBtn.textContent = 'ログイン';
        if (ok) {
            showPanel();
        } else {
            alert('パスワードが違います');
        }
    });

    sendBtn.addEventListener('click', async function () {
        const token = sendTokenEl.value.trim();
        const alertType = document.querySelector('input[name="alert"]:checked').value;
        sendBtn.disabled = true;
        sendBtn.textContent = '送信中...';
        resultEl.textContent = '';
        try {
            const res = await sendAlert(alertType, token);
            if (res.status === 200) {
                resultEl.textContent = '送信しました';
            } else if (res.status === 403) {
                resultEl.textContent = '認証エラー';
            } else {
                resultEl.textContent = 'エラー: ' + res.status;
            }
        } catch (e) {
            resultEl.textContent = '送信失敗';
        }
        sendBtn.disabled = false;
        sendBtn.textContent = '送信';
    });

    sendTokenEl.addEventListener('input', function () {
        sendBtn.disabled = sendTokenEl.value.trim() === '';
    });

    showLogin();
})();
