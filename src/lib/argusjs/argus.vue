<script lang="ts">
import axios from 'axios'

const REFRESH_DURATION = 3*60*1000 // 3 minntes

export default {
  name: 'ArgusApp',
  data() {
    return {
      mdr: {
        url: "",
      },
      tokens: {
        refresh: "",
        access: "",
      },
    }
  },
  created() {
    let urlParams = new URLSearchParams(window.location.search);
    this.mdr = {
      url: urlParams.get('aristotle'),
    }
    setInterval(this.refreshTokens, REFRESH_DURATION)

    // this.init()
  },
  mounted() {
    // this.name // type: string | undefined
    // this.msg // type: string
    // this.count // type: number
    window.addEventListener('message', this.keysListener);
  },
  methods: {
    keysListener: function(event) {
      this.tokens = JSON.parse(event.data)
      this.init()
      this.refreshTokens()

    },
    init: function() {
      console.log("No init method provided")
    },
    aristotleApi: function(api, method, data){
      return axios({
          method: method,
          url: `${this.mdr.url}${api}`,
          data: data,
          headers: {'Authorization': `Bearer ${this.tokens.access}`}
      })
    },
    refreshTokens: function() {
      this.aristotleApi("/api/jwt/token/refresh/", "post", {"refresh": this.tokens.refresh}).then(
        response => {
          console.log("REFRESHEEDEDED")
          this.tokens.access = response.data.access
          console.log(response.data.access)
          console.log(response)
        }
      )
    }
  }
}
</script>

<style>
#app {
}
</style>
