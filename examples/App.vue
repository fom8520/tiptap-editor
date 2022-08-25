<template>
  <div class="index-page">
    <button @click="getContent">获取</button>
    <button @click="setContent">保存</button>
    <button @click="clear">清除</button>
    <Editor v-model="content" :isScroll="false" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Editor from "../packages/components/editor/index.vue";

export default Vue.extend({
  name: "IndexPage",
  components: { Editor },
  data() {
    return {
      content:
        '<figure><img alt="" src="https://cdn-images-1.medium.com/max/1024/1*sN9MqmFTaTJGPj0skUkIjQ.png" /></figure><h4>Enhancing the purchase experience for users and making it more secure than ever.</h4><p>Today, we roll out an exciting update to our flagship product, the Wyre Checkout Widget. Wyre Checkout is already an industry leader in fiat-to-crypto on-ramping, but in line with our mission to make crypto accessible to the masses, we continue to improve our products to ensure anyone who wants to purchase crypto can do so easily and securely.</p><p>This new update enables an exciting new Single Sign-On (SSO) feature for returning users of the Checkout Widget.</p><h4><strong>A Simplified Experience</strong></h4><p>Single sign-on (SSO) is a way to authenticate users and sessions by using one set of login credentials across platforms. Simply put, it is like using a single name and password to access any number of different applications.</p><p>This is a feature that most people use on a daily basis. For example, if a user goes to sign up for Spotify, they are given the option to log in using various types of credentials. They can use credentials from Facebook, Apple or Google to sign up or log in to Spotify without creating a new username and password.</p><p>Many of the world’s most popular applications use this exact functionality to make the onboarding process and password management much simpler for end users, and we think crypto should be the same.</p><figure><img alt="" src="https://cdn-images-1.medium.com/max/515/0*lapp0EviWoeueMRF" /><figcaption>Many apps like Spotify leverage SSO functionality.</figcaption></figure><h3>Purchasing crypto just got easier</h3><p>Wyre believes the purchasing of crypto should be as easy as buying anything online. With our Checkout Widget being used by millions of users all over the world, it is important to continually enhance the crypto buying experience.</p><p>Utilizing the single sign-on feature, end users will recognize the familiar experience that they experience with most of their online interactions. In the case of Wyre, return users will be able to sign in using their phone number and email address in order to have their name and billing address pre-filled on the checkout page.</p><figure><img alt="" src="https://cdn-images-1.medium.com/max/1024/1*Qz9dki5MHm0pKvW8XpfeqA.png" /></figure><figure><img alt="" src="https://cdn-images-1.medium.com/max/1024/1*HSTNV-oxYNvBNoVLsjcOww.png" /><figcaption>Users will be prompted for their phone number at the start of transactions before given a one-time password (OTP) to access the SSO functionality.</figcaption></figure><p>Additionally, by implementing SSO, Wyre is able to not only offer a much more seamless buying experience for return users, but it is also able to provide a more robust fraud detection and prevention model for its partners.</p><blockquote>“User experience and security are central to our mission to bring crypto to the masses. We are focused on making buying crypto not only seamless, but also worry free. This update paves the way for offering end users and partners the best crypto buying experience in the world.” — Yanni Gianaros, CEO</blockquote><p>The update to Wyre’s Checkout, which has been expertly engineered in partnership with <a href="https://www.bolt.com/">Bolt</a>, offers the following features:</p><ul><li>Single Sign-On (SSO) capabilities for return users of Wyre Checkout</li><li>Account level fraud detection allowing “trusted users” to purchase more crypto, faster</li><li>Bolstered security to help end users and partners see more transactions approved while staying safe from fraud</li></ul><p>This is made possible by automatically issuing a Bolt Shopper Account to each user that completes a transaction within Wyre Checkout. This allows Wyre to leverage Bolt’s best in class <a href="https://www.bolt.com/blog/better-fraud-detection-with-bolt">fraud detection</a> and security models to help Wyre’s partners approve more transactions while having less dropoff and chargebacks.</p><p>These are incredibly exciting features that are going to give entrepreneurs and developers an extremely effective way to continue to onboard the masses to the Web3 ecosystem.</p><h3>Automatically Enhanced</h3><p>The great news is that partners will not have to complete <strong>any </strong>backend changes in order to benefit from this update. The update will be automatically pushed to all Checkout implementations, with very little changing for the end user.</p><p>Although the update will not require any code changes from our partners, they may want to inform end users of the new features. This could be via marketing materials (emails, social media, etc.) or within the user interface of your platforms. For more information on the end user experience, check out <a href="https://docs.sendwyre.com/docs/wyre-checkout-1">our docs</a> and <a href="https://support.sendwyre.com/hc/en-us/articles/360051697094-Wyre-Checkout-Widget">support page</a>.</p><p>If you have specific questions about the Single Sign-On Checkout Widget Update, please contact your designated representative at Wyre.</p><h4><strong>Rollout</strong></h4><p>The SSO update will be available to select partners as we perform a phased rollout. If you are one of the affected partners, you will have been notified by Wyre. Soon, all implementations of Wyre Checkout will be able to take advantage of the new SSO capabilities.</p><h4><strong>Moving Forward</strong></h4><p>Future phases of this integration will include higher limits, higher conversion rates from trusted users, saved card information, and additional added payment methods. These features will continue to increase transaction approvals, while improving user experience and accessibility for your end users. Be sure to keep an eye out for the continued improvement of Wyre’s Checkout Widget.</p><p>For more information about Wyre and how to integrate with our APIs, please visit our <a href="https://www.sendwyre.com/">Website</a> and <a href="https://docs.sendwyre.com/">Developer Documentation</a>.</p><p>Connect with our community &#38; dev team on Discord to get answers to all of your integration questions.</p><ul><li>Follow us on <a href="https://twitter.com/sendwyre?source=post_page---------------------------">Twitter</a></li><li>Follow us on <a href="https://www.linkedin.com/company/wyre/?source=post_page---------------------------">LinkedIn</a></li><li>Subscribe to us on <a href="https://www.youtube.com/channel/UC72ZT9gRV_KPxBJpw4p7S5g">YouTube</a></li><li>Join our <a href="http://eepurl.com/haTDjv">Mailing List</a></li></ul><img src="https://medium.com/_/stat?event=post.clientViewed&referrerSource=full_rss&postId=a2c15b6acead" width="1" height="1" alt=""><hr><p><a href="https://blog.sendwyre.com/wyre-checkout-widget-update-implementing-sso-a2c15b6acead">Wyre Checkout Widget Update: Implementing SSO</a> was originally published in <a href="https://blog.sendwyre.com">Wyre Blog</a> on Medium, where people are continuing the conversation by highlighting and responding to this story.</p>',
    };
  },
  methods: {
    getContent() {
      const content = localStorage.getItem("content");
      this.content = content || "";
    },
    setContent() {
      localStorage.setItem("content", this.content);
    },
    clear() {
      this.content = "";
    },
  },
});
</script>

<style lang="scss" scoped>
.index-page {
  max-width: 800px;
  height: 100%;
  margin: 0 auto;
}
</style>
