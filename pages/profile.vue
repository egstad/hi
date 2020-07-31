<template>
  <section class="box-wrap">
    <div class="rect" v-if="$store.state.user.isAnon">
      <h2>it's nice to see you.</h2>
      <p>
        while having an account has some perks, you don't one to participate.
        feel free to contribute anonymously.
      </p>
      <br />
      <p>
        that said. we aren't creeps. we're not using analytics. we're not
        harvesting your data.
      </p>
      <p>if you would like you sign up, create an account</p>
    </div>

    <ProfileLogin
      v-if="!$store.state.user.isLoggedIn"
      ref="login"
      class="rect login"
    />

    <!-- <div class="rect" v-if="$store.state.user.isLoggedIn">
      <h2>profile</h2>
      <br />
      <ProfileLogout />
      <ProfileActions />
    </div> -->
    <aside class="wtf">
      <header>
        <h3 class="t-headline">wtf<br />is<br />this?</h3>
      </header>
      <svg viewBox="0 0 43 43" xmlns="http://www.w3.org/2000/svg">
        <circle cx="21.5" cy="21.5" r="21.5" />
      </svg>
    </aside>

    <ProfileCreate
      class="rect register"
      v-if="!$store.state.user.isLoggedIn || $store.state.user.isAnon"
    />

    <div
      class="rect"
      v-if="$store.state.user.isLoggedIn && !$store.state.user.isAnon"
    >
      <h2>reset password</h2>
      <p>
        we're all humans. sometimes we forget things. other times, shit happens
        and we need to change our password. no problem - what was your email for
        the account? we'll send you a reset link.
      </p>
      <br />
      <ProfileReset />
    </div>
  </section>
</template>

<script>
import ProfileLogin from '@/components/organisms/profile-login'
// import ProfileLogout from '@/components/organisms/profile-logout'
// import ProfileActions from '@/components/organisms/profile-actions'
import ProfileCreate from '@/components/organisms/profile-create'
import ProfileReset from '@/components/organisms/profile-reset'
export default {
  components: {
    ProfileLogin,
    // ProfileLogout,
    // ProfileActions,
    ProfileCreate,
    ProfileReset,
  },
}
</script>

<style lang="scss" scoped>
h2 {
  font-size: 54px;
  line-height: 0.7;
  text-indent: -0.036em;
  margin-bottom: 60px;
}

ol {
  list-style-type: decimal;
  list-style-position: inside;
  // padding-left: var(--grid-gutter);
}

.box-wrap {
  width: 100%;
  display: grid;
  grid-gap: var(--grid-gutter);

  @media (min-width: 560px) {
    // grid-template-columns: repeat(auto-fill, minmax(min-content, 500px));
    height: 100%;
    align-items: end;
    justify-content: center;
    // grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    justify-content: start;
    grid-template-columns: 1fr 1fr 1fr;

    .rect {
      max-width: none;
    }
  }

  @media (min-width: 1600px) {
    grid-template-columns: repeat(auto-fill, minmax(min-content, 500px));
  }
}

.rect {
  background: #0f68ed;
  color: white;
  border-radius: calc(var(--note-radius) * 2);
  padding: 40px var(--grid-gutter) var(--grid-gutter);
  width: 100%;
  max-width: 560px;

  /deep/header {
    margin-bottom: calc(var(--grid-gutter) * 4);
    margin-bottom: clamp(
      calc(var(--grid-gutter) * 4),
      10vw,
      calc(var(--grid-gutter) * 6)
    );
  }
  /deep/.text-wrap {
    padding: 0 calc(var(--grid-gutter) * 0.75);
  }

  &.login {
    background: #504e4d;
    color: white;

    /deep/.form-item {
      color: #504e4d;
    }
  }

  &.register {
    background: #0f68ed;
    color: white;

    /deep/.form-item {
      color: #0f68ed;
    }

    /deep/.button {
      color: #0f68ed;
    }
  }
}

/deep/.contextual {
  transition: height 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  height: 0;
  overflow: hidden;

  &.is-expanded {
    pointer-events: auto;
    height: calc(var(--input-height) + var(--grid-gutter));

    .button {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
}

.wtf {
  animation: rotate 33s ease-in-out infinite;
  position: relative;
  color: white;
  text-align: center;

  svg {
    display: block;
    fill: #f09e00;
  }

  header {
    position: absolute;
    transform: translate3d(-50%, -50%, 0);
    top: 50%;
    left: 50%;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  90% {
    transform: rotate(360deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
