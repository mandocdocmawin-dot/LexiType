# LexiType: Advanced Typing Practice and Analytics Platform

## Project Overview

LexiType is a comprehensive web-based typing practice platform designed to help users improve their typing speed, accuracy, and technique through structured exercises, performance tracking, and intelligent recommendations. The application combines modern web technologies with a sophisticated backend architecture to deliver a seamless typing learning experience.

The platform caters to users of varying skill levels by offering both system-provided typing exercises and personalized custom exercises. Users can track their progress through detailed performance metrics, receive AI-driven feedback based on their keystroke patterns, and compare their achievements on an interactive leaderboard. The administrative interface provides comprehensive tools for managing users, overseeing system exercises, and reviewing user feedback.

## System Architecture: Database Design

### Database Overview

LexiType utilizes a relational database architecture with nine core tables, each serving a distinct purpose in the system. The database employs a normalized structure that maintains referential integrity through cascading relationships, ensuring that user data is properly managed throughout the application lifecycle.

### Core Database Tables and Relationships

#### User Management

The foundation of the system rests on the **Users table**, which stores essential user account information including unique identifiers (UUID), user names, email addresses with uniqueness constraints, email verification status, and encrypted passwords. This table serves as the primary entity from which all user-related data branches.

Connected to the Users table is the **User Profiles table**. This table extends the core user data by allowing users to maintain biographical information through a dedicated bio field. Each user can have one user profile, establishing a one-to-one relationship that enhances the user's personal branding within the platform.

#### Performance and Statistics Tracking

The **User Stats table** aggregates typing performance metrics for each user. It maintains three key statistics: average words-per-minute (WPM), highest WPM achieved in any session, and the total count of typing tests completed. These aggregated metrics provide users with an overview of their typing proficiency and progress over time. This table maintains a one-to-one relationship with the Users table, ensuring each user has exactly one statistics record.

The **Typing Sessions table** records every individual typing practice session. For each session, the system captures the words-per-minute score, accuracy percentage, session duration in seconds, and the difficulty level attempted. This granular data collection allows for comprehensive performance analysis and trend identification over multiple sessions. A user can have many typing sessions, establishing a one-to-many relationship with the Users table.

#### Keystroke Analysis

The **Keystroke Mistakes table** provides detailed insights into typing errors at the character level. Each keystroke mistake record documents what character was expected to be typed, what character was actually typed, and the response time in milliseconds. These records are directly associated with specific typing sessions through a one-to-many relationship, enabling analysis of error patterns and typing behavior on a keystroke-by-keystroke basis.

#### Exercise Management

The **System Typing Texts table** contains typing exercises provided by the system. Each exercise entry includes categorization information, the textual content to be typed, a difficulty level indicator (Easy as 1, Medium as 2, Hard as 3), and an active status flag. System administrators manage these exercises, and users are assigned them based on their proficiency level. This creates a one-to-many relationship where users can access multiple system typing texts.

The **Custom Exercises table** enables users to create personalized typing practice materials. Each custom exercise contains the custom text to be typed and a completion status indicator. Users maintain complete ownership of their custom exercises, with each user capable of creating and managing multiple custom exercise entries.

#### Feedback and Recommendations

The **User Feedbacks table** collects user feedback and suggestions through text messages submitted by users. This table maintains a one-to-many relationship with Users, allowing users to submit multiple feedback entries over time. This feedback mechanism provides valuable insights into user experience and platform improvement opportunities.

The **AI Recommendations table** stores intelligent recommendations generated for users based on their typing performance. Each recommendation record contains a feedback message providing user-specific guidance and a focus letters field identifying specific characters or key combinations that require practice attention. The system generates multiple recommendations per user, maintaining a one-to-many relationship with the Users table.

### Data Integrity and Relationships

All user-related tables implement cascading delete operations, ensuring that when a user account is deleted, all associated data (profiles, statistics, sessions, feedback, recommendations, exercises) is automatically removed from the database. This maintains referential integrity and prevents orphaned records.

## Frontend Architecture: UI/UX Structure

### Frontend Technology Stack

LexiType employs a modern JavaScript-based frontend architecture utilizing React as the view library and Inertia.js as the adapter layer for seamless server-side integration. The frontend is structured through the Vite build tool, providing fast development and optimized production builds.

### Folder Organization

#### Layouts Directory

The **Layouts** directory contains reusable page framework components that provide consistent navigation, headers, and structural elements across the application.

The **GuestLayout** serves users who have not yet authenticated. It provides a minimalist interface suitable for the Welcome page and authentication forms, with navigation elements for Login and Register options.

The **AuthenticatedLayout** is the primary layout for logged-in users. It includes a persistent navigation bar with the application logo, dashboard link, and a user dropdown menu providing access to profile settings and logout functionality. This layout forms the wrapper for all user-accessible features and content.

The **AdminLayout** (if implemented) provides an extended interface for administrative users, including additional navigation elements for administrative functions such as user management and system configuration.

#### Components Directory

The **Components** directory contains reusable UI elements and functional components that are composed together to build pages.

Common components include **TextInput** for text entry fields, **InputLabel** for form labels, **InputError** for validation error display, **Modal** for dialog boxes, **Dropdown** for navigation menus, and various button components such as **PrimaryButton**, **SecondaryButton**, and **DangerButton**.

The **AiChatModal** component (designated for future development) will implement a floating modal interface through which users can interact with the AI recommendation system, asking questions and receiving personalized typing improvement suggestions.

Additional components include **Leaderboard** for displaying competitive rankings, **Feedback** for collecting and displaying user comments, and **Checkbox** for boolean input fields.

#### Pages Directory

The **Pages** directory contains complete page components that represent distinct views in the application.

The main page structure includes **Welcome.jsx**, which serves as the landing page for unauthenticated users, presenting marketing content and login/registration options. The **Dashboard.jsx** serves as the primary authenticated user landing page. The **AboutApp.jsx** page provides informational content about the LexiType platform and its features.

##### Profile Section

The Profile section contains **Edit.jsx**, the main profile editing interface. Within this section, the **Partials** subfolder contains specialized forms: **UpdateProfileInformationForm.jsx** for personal information updates, **UpdatePasswordForm.jsx** for password changes, and **DeleteUserForm.jsx** for account deletion.

##### User Section

The User section provides user-specific views including **Profile.jsx** for viewing user profile information and **Stats.jsx** for detailed performance statistics and progress tracking.

##### Admin Section

The Admin section restricts access to administrative users and includes:

- **Overview.jsx**: A dashboard providing system-wide statistics and administrative controls
- **ManageUsers.jsx**: Interface for user account management, including suspension, role assignment, and account oversight
- **FeedbackInbox.jsx**: Centralized collection and review of all user feedback submissions
- **CustomExercise.jsx**: Administrative interface for managing and approving user-created custom exercises

## User Roles and Access Control

### Guest Access Level

Users who have not authenticated with the system operate at the Guest access level. Guest users can view the Welcome page, which contains marketing information about LexiType and its features. The Welcome page provides direct access to the authentication system through Login and Register options. Guests cannot access any typing exercises, performance tracking features, or personal user accounts.

### Authenticated User Access Level

Upon successful authentication, users gain access to the Authenticated User feature set. These users can:

- Access the Dashboard as their primary landing page after login
- View and edit their personal profile information, including biographical data
- Create and manage custom typing exercises tailored to their specific needs
- Participate in typing practice sessions using both system-provided and custom exercises
- Track detailed performance statistics including average WPM, highest WPM, and session history
- View keystroke-level error analysis from their typing sessions
- Receive AI-generated recommendations based on their performance patterns
- Submit feedback and suggestions to improve the platform
- View competitive rankings on the Leaderboard
- Change account password and manage authentication credentials

### Administrator Access Level

Administrative users possess elevated permissions and access to system-wide management capabilities. In addition to all Authenticated User features, administrators can:

- Access the Admin Overview dashboard displaying system-wide statistics and metrics
- Manage user accounts through the Manage Users interface, including account status and role adjustments
- Review all user feedback submissions through the Feedback Inbox
- Approve, modify, or reject user-created custom exercises through the Custom Exercise management interface
- Create and manage system typing texts with varying difficulty levels
- Configure system parameters and maintain platform health

## Key Components and Features

### Typing Session Architecture

When users initiate a typing practice session, the system captures comprehensive performance data. Each session records the user's typing speed measured in words-per-minute, their accuracy as a percentage, the session duration, and the difficulty level of the exercise. 

At the keystroke level, the system records each character that was incorrectly typed, what was expected, and the response time in milliseconds. This granular data collection enables sophisticated analysis of typing patterns, common mistakes, and areas requiring improvement.

### AI Recommendation System

The AI Recommendations feature analyzes user performance data to generate personalized improvement guidance. Each recommendation contains two key components: a feedback message providing contextual guidance specific to the user's performance, and a focus letters field highlighting specific characters or key combinations that require additional practice attention.

This intelligent system learns from user performance trends and identifies problematic areas, enabling users to focus their practice efforts on the most impactful improvements.

### Custom Exercise Framework

Users can create custom typing exercises using any text content, allowing for practice tailored to their specific interests or learning objectives. Each custom exercise contains the text content to be practiced and a completion status indicator. This feature enables users to practice with domain-specific terminology, programming syntax, foreign language texts, or any content relevant to their typing goals.

### Performance Metrics and Statistics

The User Stats table maintains aggregated performance metrics that provide a high-level overview of user progress. These include average WPM calculated across all sessions, the highest WPM achieved in any single session, and the cumulative count of typing tests completed. This aggregated view allows users to quickly assess their overall typing proficiency and track long-term progress.

### User Feedback System

Users can submit feedback regarding their experience with the LexiType platform. This feedback is collected through the feedback submission interface and stored in the User Feedbacks table. Administrative users can access all feedback through the Feedback Inbox, enabling continuous improvement of the platform based on user input.

### Leaderboard and Social Features

The Leaderboard component displays competitive rankings of users based on their typing performance metrics. This social feature encourages user engagement and friendly competition while allowing users to benchmark their performance against the broader user community.

## Data Flow and Integration

### Session Data Collection Pipeline

When a user completes a typing exercise, the following data flow occurs:

1. The frontend application captures keystroke-by-keystroke data during the typing session
2. Session completion triggers data transmission to the backend server
3. The backend processes the session data and creates a Typing Session record with aggregate metrics
4. For each keystroke error detected, the system creates a Keystroke Mistake record
5. User Stats are updated to reflect the new session's impact on average WPM and total tests taken
6. The system optionally generates or updates AI Recommendations based on the new data

### Recommendation Generation Pipeline

The AI Recommendation system operates asynchronously to user session data:

1. Session keystroke data is analyzed for error patterns
2. Frequently occurring character mistakes are identified
3. The system generates a recommendation entry with guidance and focus letters
4. The recommendation becomes available to the user through the AI Chat Modal or profile page

### Administrative Data Aggregation

Administrative views aggregate data from multiple tables to present system-wide insights:

1. The Overview dashboard queries user statistics to display total active users and average platform performance
2. Feedback statistics are compiled from the User Feedbacks table
3. Custom Exercise approval status is tracked and presented for administrative action
4. System Typing Texts status and usage metrics inform content management decisions

## Technology Stack Summary

### Backend Architecture

LexiType is built on the Laravel framework with PHP, providing a robust server-side foundation. The application uses a PostgreSQL or MySQL relational database with eloquent ORM for database interaction. Laravel's built-in authentication system handles user credential management and session handling.

### Frontend Architecture

The frontend utilizes React for component-based UI development with Inertia.js serving as the bridge layer between frontend and backend. Tailwind CSS provides utility-first styling, enabling rapid UI development with consistent design patterns. The Vite build tool provides fast development and optimized production builds.

### Development and Testing

The project includes PHPUnit for backend testing and Pest for BDD-style testing. ESLint provides frontend code quality analysis. The application includes comprehensive database factories and seeders for testing and development scenarios.

## Conclusion

LexiType represents a comprehensive platform for typing skill development through modern web technologies and sophisticated data analysis. The system architecture balances user accessibility with administrative control, providing both casual users and power users with appropriate tools for their needs. The database design ensures data integrity while supporting complex queries for analytics and recommendations. The frontend architecture provides a responsive, intuitive user experience optimized for typing practice workflows.
