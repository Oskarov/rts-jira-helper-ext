export interface IJiraIssues {
    maxResults: number,
    total: number,
    issues: IIssue[]
}

export interface IIssue {
    id: string,
    key: string, // номер типа TMS-2121
    fields: {
        resolution: { // статус
            id: string,
            name: string,
            description: string
        } | null,
        status: {
            name: string
        }
        labels: string[],
        aggregatetimeoriginalestimate: number | undefined,
        issuelinks: any[],
        assignee: {
            name: string,
            emailAddress: string,
            displayName: string
        },
        reporter: {
            name: string,
            emailAddress: string,
            displayName: string
        },
        progress: {
            progress: number,
            total: number,
            persent: number
        },
        worklog: {
            maxResults: number,
            total: number,
            worklogs: {
                timeSpentSeconds: number
            }[],
        },
        issuetype: {
            id: string,
            description: string,
            name: string
        },
        timeoriginalestimate: number | undefined,
        timetracking: {
            originalEstimate: string,
            remainingEstimate: string,
            originalEstimateSeconds: number,
            remainingEstimateSeconds: number
        } | {},
        summary: string,
        aggregateprogress: {
            progress: 0,
            total: 10800,
            percent: 0,
        },
    }
}