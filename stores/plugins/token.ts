import { MutationType } from "pinia";
// import {
//   getLocatieToken,
//   getTokenData,
//   removeLocatieToken,
//   removeToken,
//   setLocatieToken,
//   setToken,
// } from "../../util/token";
// import { useUserStore } from "../user";

// FIXME:
// export const saveTokenPlugin = (store: any) => {
//   const token = getTokenData();
//   if (token) {
//     store.setToken(token);
//   }

//   const locatieToken = getLocatieToken();
//   if (locatieToken) {
//     store.setLocatieToken(locatieToken);
//   }

//   useUserStore().$subscribe((mutation, state) => {
//     if (mutation.type === "setToken") {
//       if (mutation.payload) {
//         setToken(mutation.payload);
//       } else {
//         removeToken();
//       }
//     }
//     if (mutation.type === "setLocatieToken") {
//       if (mutation.payload) {
//         setLocatieToken(mutation.payload);
//       } else {
//         removeLocatieToken();
//       }
//     }
//   });
// };

