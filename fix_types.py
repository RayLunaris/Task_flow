import os

files_to_fix = [
    "src/components/layout/Navbar.tsx",
    "src/components/team/DepartmentDetailView.tsx",
    "src/pages/ReportPage.tsx",
    "src/pages/TeamPage.tsx",
    "src/utils/exportUtils.ts",
    "src/components/team/DepartmentCard.tsx",
    "src/components/team/DepartmentFormModal.tsx",
    "src/components/team/MemberCard.tsx",
    "src/components/team/TeamFormModal.tsx",
    "src/components/comments/CommentList.tsx"
]

for file in files_to_fix:
    path = "/home/ray/Proyek/TaskFlow/" + file
    if not os.path.exists(path): continue
    with open(path, "r") as f:
        content = f.read()
    
    original = content
    # Safe string replacements
    if "import type { User, PublicUser" not in content:
        content = content.replace("import type { User,", "import type { User, PublicUser,")
        content = content.replace("import type { User }", "import type { User, PublicUser }")
        content = content.replace("import type { Department, User }", "import type { Department, User, PublicUser }")
        content = content.replace("import type { Department, User, UserRole, UserStatus }", "import type { Department, User, PublicUser, UserRole, UserStatus }")
        content = content.replace("import type { User, UserRole, UserStatus }", "import type { User, PublicUser, UserRole, UserStatus }")
        content = content.replace("import type { Task, Project, User, Milestone }", "import type { Task, Project, User, PublicUser, Milestone }")
    
    # Props and Variables Types
    content = content.replace("users: User[]", "users: PublicUser[]")
    content = content.replace("member: User\n", "member: PublicUser\n")
    content = content.replace("member: User;", "member: PublicUser;")
    content = content.replace("members: User[]", "members: PublicUser[]")
    content = content.replace("allUsers: User[]", "allUsers: PublicUser[]")
    content = content.replace("<User[]>", "<PublicUser[]>")
    content = content.replace("as User\n", "as PublicUser\n")
    content = content.replace("as User;", "as PublicUser;")
    
    # Specific edge cases for Navbar
    if file == "src/components/layout/Navbar.tsx":
        if "import type { User" not in content and "PublicUser" not in content:
            content = "import type { PublicUser } from '../../types';\n" + content
            content = content.replace("user: any;", "user: PublicUser | null;")
    
    if content != original:
        with open(path, "w") as f:
            f.write(content)
        print(f"Fixed {file}")
