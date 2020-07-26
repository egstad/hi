<template>
  <section>
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

    <div class="box" v-if="!$store.state.user.isLoggedIn">
      <h2>login</h2>
      <br />
      <ProfileLogin />
    </div>

    <div class="box" v-if="$store.state.user.isLoggedIn">
      <h2>profile</h2>
      <br />
      <ProfileLogout />
    </div>

    <div
      class="box"
      v-if="!$store.state.user.isLoggedIn || $store.state.user.isAnon"
    >
      <h2>create a profile</h2>
      <br />
      <ProfileCreate />
    </div>
  </section>
</template>

<script>
import ProfileLogin from '@/components/profile-login'
import ProfileLogout from '@/components/profile-logout'
import ProfileCreate from '@/components/profile-create'
export default {
  components: {
    ProfileCreate,
    ProfileLogin,
    ProfileLogout,
  },
  async asyncData(context) {
    // await context.store.dispatch('user/authenticate')
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

.box {
  // display: flex;
  // flex-direction: column;
  // align-self: center;
  // justify-content: center;
  margin-bottom: 20px;
  background: white;
  color: black;
  border-radius: 11px;
  padding: 40px 20px;
  width: 100%;

  @media (min-width: 600px) {
    max-width: 500px;
    width: auto;
    height: auto;
  }

  box-shadow: 0px 0.498106px 2.21381px rgba(0, 0, 0, 0.0365489),
    0px 1.19702px 5.32008px rgba(0, 0, 0, 0.0525061),
    0px 2.25388px 10.0172px rgba(0, 0, 0, 0.065),
    0px 7.51997px 33.4221px rgba(0, 0, 0, 0.0934511);
}
</style>
