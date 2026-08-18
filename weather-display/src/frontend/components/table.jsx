import "../components.css"

function Table() {
    return (
        <>

            <h2>暑さ指数（WBGT）</h2>

            <table>
                <thead>
                    <tr>
                        <th>暑さ指数（WBGT）</th>
                        <th>予防策</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="special-alert">危険（35以上）</td>
                        <td>
                            熱中症特別警戒アラート
                        </td>
                    </tr>
                    <tr>
                        <td className="nomal-alert">危険（33以上）</td>
                        <td>
                            熱中症警戒アラート
                        </td>
                    </tr>
                    <tr>
                        <td className="kiken">危険（31以上）</td>
                        <td>
                            原則 運動は中止
                        </td>
                    </tr>
                    <tr>
                        <td className="genjyu">厳重警戒（28~31）</td>
                        <td>
                            激しい運動は中止
                        </td>
                    </tr>
                    <tr>
                        <td className="keikai">警戒（25~28）</td>
                        
                        <td>
                            積極的に休憩をとる
                        </td>
                    </tr>
                    <tr>
                        <td className="tyuui">注意（25以下）</td>
                        <td>
                            積極的に水分をとる
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default Table