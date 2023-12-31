import React, {useState} from 'react';
import {standardButton}  from "../../../styleTemplates/standardButton";

interface InfoProps {

}

const Info: React.FC<InfoProps> = ({}) => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <div className="dream-btn" onClick={() => setOpen(open => !open)}
                 style={standardButton}>Посмотреть справку
            </div>
            {open &&
            <div style={{width: "500px"}}>
                <h1>Сбор статистики по спринту в Jira</h1>
                <p style={{paddingBottom: "8px", marginBottom: "8px", borderBottom: "1px solid black"}}>
                    Программа интегрирует две кнопки в тело страницы борды. Работают они одинаково,
                    но "Разработка завершена" считает выполненными любые задачи в статусе следующем за "код ревью", а
                    Только готовые считает выполненными только закрытые задачи в статусах "готово" и "done"
                </p>
                <p style={{paddingBottom: "8px", marginBottom: "8px", borderBottom: "1px solid black"}}>
                    Задачи бьются на три бакет по условиями вхождения в <code>['Product', 'product']</code> для
                    продуктовых
                    тасок, <code>['TechDebt', 'techDebt', 'techdebt', 'tech-debt']</code> для
                    техдолга, <code>['Support', 'support']</code> для багов.
                </p>
                <p>
                    "Часы" заложенные на задачу высчитываются из суммарного времени задачи - это собственное время
                    задачи +
                    время подзадач,
                    которые прописаны в поле "Исходная оценка (например, 3w 4d 12h)". Очень важно чтобы подзадачи были
                    типа
                    "фронтенд подзадача", "бэкенд подзадача".
                    Затраченное время высчитывается из суммарной оценки переданной в массиве worklogs по каждой задаче.
                </p>
            </div>
            }
        </div>
    )
}

export default Info;
