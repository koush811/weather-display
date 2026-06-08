import "../components.css"

function Table(){
    return(
        <>
           <table>
                <h2>暑さ指数（WBGT）</h2>
                <tr>
                    <th>暑さ指数（WBGT）</th>
                    <th>注意すべき生活活動の目安</th>
                    <th>注意事項</th>
                </tr>
                <tr>
                    <td className="kiken">危険（31以上）</td>
                    <td>すべての生活活動で起こる危険性</td>
                    <td>
                      高齢者においては安静状態でも発生する危険性が大きい。
                      外出はなるべく避け、涼しい室内に移動する。
                    </td>
                </tr>
                <tr>
                    <td className="genjyu">厳重警戒（28以上31未満）</td>
                    <td>すべての生活活動で起こる危険性</td>
                    <td>
                      外出時は炎天下を避け、室内では室温の上昇に注意する。
                    </td>
                </tr>
                <tr>
                    <td className="keikai">警戒（25以上28未満）</td>
                    <td>中東以上の生活活動で起こる危険性</td>
                    <td>
                      運動や激しい作業をする際は定期的に充分に休息を取り入れる。
                    </td>
                </tr>
                <tr>
                    <td className="tyuui">注意（25以上）</td>
                    <td>強い生活活動で起こる危険性</td>
                    <td>
                      一般に危険性は少ないが激しい運動や重労働時には発生する危険性がある。
                    </td>
                </tr>
            </table> 
        </>
    )
}

export default Table