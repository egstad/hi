<template>
  <section class="box-wrap">
    <div class="box" v-if="$store.state.user.isAnon">
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

    <div class="box login" v-if="!$store.state.user.isLoggedIn">
      <h2>login</h2>
      <br />
      <ProfileLogin />
    </div>

    <div class="box" v-if="$store.state.user.isLoggedIn">
      <h2>profile</h2>
      <br />
      <ProfileLogout />
      <ProfileActions />
    </div>

    <div
      class="box register"
      v-if="!$store.state.user.isLoggedIn || $store.state.user.isAnon"
    >
      <h2>create a profile</h2>
      <br />
      <ProfileCreate />
    </div>

    <div
      class="box"
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
import ProfileLogin from '@/components/profile-login'
import ProfileLogout from '@/components/profile-logout'
import ProfileActions from '@/components/profile-actions'
import ProfileCreate from '@/components/profile-create'
import ProfileReset from '@/components/profile-reset'
export default {
  components: {
    ProfileLogin,
    ProfileLogout,
    ProfileActions,
    ProfileCreate,
    ProfileReset,
  },
  async asyncData(context) {
    await context.store.dispatch('user/authenticate')
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
  // padding-left: 20px;
}

.box-wrap {
  width: 100%;
  display: grid;
  grid-gap: 20px;

  @media (min-width: 1600px) {
    height: 100%;
    display: grid;
    grid-gap: 20px;
    align-items: end;
    grid-template-columns: repeat(4, 1fr);
  }
}

.box {
  background: blue;
  color: white;
  border-radius: 11px;
  box-sizing: border-box;
  padding: 40px 20px;
  width: 100%;
  // overflow-x: auto;
  overflow: hidden;

  @media (min-width: 600px) {
    width: auto;
    height: auto;
  }

  &.login {
    background: #92877f;
    color: white;

    /deep/.form-item {
      color: #92877f;
    }
  }

  &.register {
    background: #fdae15;
    color: white;

    /deep/.form-item {
      color: #fdae15;
    }
  }
}
</style>
