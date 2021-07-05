<script>
    export let name;
    export let profilePicture;
</script>

<div class="user-profile">
    <div class="avatar">
        <img src="{profilePicture ? `data:image/jpg;base64,${profilePicture}` : '/avatar.png'}" alt="Avatar" />
    </div>
    <h1 class="username">
        { name }
    </h1>
</div>

<style>
    h1 {
        font-size: 2rem;
    }

    .username {
        text-align: center;
    }

    .user-profile {
        display: grid;
        justify-content: center;
    }

    .avatar {
        text-align: center;
    }

    .avatar img {
        margin-top: 20px;
        border-radius: 50%;
        height: 128px;
        width: 128px;
    }

    @media (max-width: 1200px) {
        h1 {
            font-size: 1.5rem;
        }
    }
    
    @media (max-width: 900px) {
        h1 {
            font-size: 1.2rem;
        }
    }

    @media screen and (max-width: 600px){
        .avatar img {
            height: 120px;
        }

        h1 {
            font-size: 2rem;
        }
    }
</style>
