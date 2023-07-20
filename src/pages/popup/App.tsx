import React, {useEffect, useState} from 'react'
import storage                      from "../../storage";

const App = (): JSX.Element => {

    const [setting, setSetting] = useState(storage.getItem('testSetting') ? !!storage.getItem('testSetting') : false);

    useEffect(() => {
        storage.setItem('testSetting', setting);
    }, [setting])

    return (
        <div style={{width: "500px"}}>
            <h1>Сбор статистики по спринту в Jira</h1>
            <p style={{paddingBottom: "8px", marginBottom: "8px", borderBottom: "1px solid black"}}>
                Программа интегрирует две кнопки в тело страницы борды. Работают они одинаково,
                но "Разработка завершена" считает выполненными любые задачи в статусе следующем за "код ревью", а
                Только готовые считает выполненными только закрытые задачи в статусах "готово" и "done"
            </p>
            <p style={{paddingBottom: "8px", marginBottom: "8px", borderBottom: "1px solid black"}}>
                Задачи бьются на три бакет по условиями вхождения в <code>['Product', 'product']</code> для продуктовых
                тасок, <code>['TechDebt', 'techDebt', 'techdebt', 'tech-debt']</code> для
                техдолга, <code>['Support', 'support']</code> для багов.
            </p>
            <p>
                "Часы" заложенные на задачу высчитываются из суммарного времени задачи - это собственное время задачи +
                время подзадач,
                которые прописаны в поле "Исходная оценка (например, 3w 4d 12h)". Очень важно чтобы подзадачи были типа
                "фронтенд подзадача", "бэкенд подзадача".
                Затраченное время высчитывается из суммарной оценки переданной в массиве worklogs по каждой задаче.
            </p>
            <input type="checkbox" checked={setting} onChange={(e) => setSetting(setting => !setting)}/>
        </div>
    )
}

export default App
