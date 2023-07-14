/*
  Name: pocketbase.js
  Author: Trent Brew (https://github.com/trentbrew)
  Last edited: 05/12/2023
  Description: This file contains a collection of global helper functions for interacting with the PocketBase API.
*/

import { defineNuxtPlugin } from '#app'
import PocketBase from 'pocketbase'

const pocketbase = new PocketBase('https://cultivationconnect.fly.dev')

const pb = {
  api: pocketbase,

  // Fetch a list of records from the specified collection.

  get: (collection, params, batchSize) => {
    let record = pocketbase.collection(collection)
    if (params?.id) {
      return record.getOne(params.id, { $autoCancel: false }).then(data => {
        return data
      })
    } else {
      console.log('getting the full list: ', collection, params)
      return record
        .getFullList(batchSize || 200, {
          ...params,
          $autoCancel: false,
        })
        .then(data => {
          return data
        })
    }
  },

  // Create a new record in the specified collection

  post: async (collection, data, params) => {
    const formData = new FormData()
    Object.entries(data).forEach(entry => formData.append(entry[0], entry[1]))
    return await pocketbase.collection(collection).create(formData, {
      ...params,
      $autoCancel: false,
    })
  },

  // Update an existing record in the specified collection

  update: async (collection, id, data, params) => {
    return await pocketbase.collection(collection).update(id, data, {
      ...params,
      $autoCancel: false,
    })
  },

  // Delete an existing record in the specified collection

  delete: async (collection, id) => {
    return await pocketbase.collection(collection).delete(id)
  },

  // Watch for changes to a record in the specified collection

  subscribe: async (collection, id, callback) => {
    return await pocketbase.collection(collection).subscribe(id, callback)
  },

  // Stop watching for changes to a record in the specified collection

  unsubscribe: async (collection, id) => {
    return await pocketbase.collection(collection).unsubscribe(id)
  },

  // Create a new user via email and password

  signup: async payload => {
    const form = new FormData()
    Object.entries(payload).forEach(entry => form.append(entry[0], entry[1]))
    return await pocketbase.collection('users').create(form)
  },

  // Authenticate a user via email and password

  login: async payload => {
    return await pocketbase
      .collection('users')
      .authWithPassword(payload.email, payload.password)
  },

  // Log out the current user

  logout: () => {
    return pocketbase.authStore.clear()
  },

  // Get the current user's avatar URL

  getAvatarUrl: async () => {
    const model = pocketbase.authStore.model
    const record = await pocketbase.collection('users').getOne(model.id)
    if (model.avatar) return await pocketbase.getFileUrl(record, model.avatar)
    return 'https://cultivationconnect.fly.dev/api/files/dsgp80sss2cymxu/y7512eb8ebogvhq/avatar_fskQo9FywP.png'
  },
}

export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      pb,
    },
  }
})
