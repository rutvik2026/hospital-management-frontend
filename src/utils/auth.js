export const getLoggedInUser = () => {

    try {

        const user =
            JSON.parse(
                localStorage.getItem("user")
            );

        return user;

    } catch (error) {

        console.error(
            "Unable to read user:",
            error
        );

        return null;
    }
};


export const getUserId = () => {

    const user = getLoggedInUser();

    return (
        user?.userId ??
        user?.id ??
        user?.user?.userId ??
        user?.user?.id
    );
};


export const getUserRole = () => {

    const user = getLoggedInUser();

    const role =
        user?.role ??
        user?.userRole ??
        user?.user?.role ??
        user?.user?.userRole;

    return role?.toUpperCase();
};