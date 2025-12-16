export interface UserInformation {
    Name: string;
}

export interface TaskItem {
    Id: string; // Guid
    Title: string;
    Description: string | null;

    Progress: number;

    StartDate: string | null; // DateOnly "yyyy-MM-dd"
    DueDate: string | null;   // DateOnly "yyyy-MM-dd"
    StartTime: string | null; // TimeOnly "HH:mm:ss"
    DueTime: string | null;   // TimeOnly "HH:mm:ss"

    IsDeleted: boolean;
    IsCompleted: boolean;

    CreatedAt: string; // DateTime ISO 8601
    UpdatedAt: string; // DateTime ISO 8601
    CompletedAt: string | null; // DateTime? ISO 8601
}

export interface TaskGroup {
    Id: string; // Guid
    Title: string;
    Description: string | null;

    Tasks: TaskItem[];

    CreatedAt: string;
    UpdatedAt: string;
}

export interface TaskList {
    Id: string; // Guid
    Title: string;
    Description: string | null;

    UngroupedTasks: TaskItem[];
    TaskGroups: TaskGroup[];

    CreatedAt: string;
    UpdatedAt: string;
}

export interface Project {
    Id: string; // Guid
    Name: string;
    Description: string | null;

    TaskLists: TaskList[];

    CreatedAt: string;
    UpdatedAt: string;
}

export interface Profile {
    UserInfo: UserInformation;
    Projects: Project[];

    CreatedAt: string;
    UpdatedAt: string;
}