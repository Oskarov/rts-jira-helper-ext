import React, {useEffect, useState} from 'react';
import {IProject}                            from "../../../interfaces/IProject";

interface AddProjectProps {

}

const Projects: React.FC<AddProjectProps> = ({}) => {
    const [projectsList, setProjectsList] = useState<IProject[]>([]);

    useEffect(() => {
        const fetchData = async ()=>{
            try {
                let response = await fetch('https://jira.eapteka.ru/rest/api/2/project');

                if (response.ok) {
                    let json = await response.json();
                    setProjectsList(json);
                } else {
                    alert("Ошибка HTTP: " + response.status);
                }
            } catch (e) {

            }
        }

        fetchData();

    }, []);



    return <div>
            {projectsList.map(item=><div key={item.id}>{item.name} ({item.key} - {item.id})</div>)}
    </div>;
}

export default Projects;
