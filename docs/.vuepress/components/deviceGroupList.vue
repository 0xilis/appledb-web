<template>
    <!--<div class="navigator">
        <router-link to="../">Home</router-link><span/>
        <router-link to="./">Device Selection</router-link>
    </div>-->

    <p v-for="s in introStr" :key="s">{{ s }}</p>

    <template v-for="o in groupObj" :key="o">
        <h2>{{ o.label }}</h2>
    
        <table v-for="t in Math.ceil(o.types.length / colCount)" :key="t">
            <tr :style="`width: ${parseInt(100 / colCount)}%;`">
                <th v-for="c in colCount" :key="c" :style="{'width': parseInt(100 / colCount) + '%'}">
                    <router-link v-if="o.types[(t - 1) * colCount + c - 1]" :to="
                        `/device-selection/${o.types[(t - 1) * colCount + c - 1].fdn()}.html`
                    ">
                        {{ o.types[(t - 1) * colCount + c - 1] }}
                    </router-link>
                </th>
            </tr>
            <tr>
                <td v-for="c in colCount" :key="c">
                    <router-link v-if="o.types[(t - 1) * colCount + c - 1]" :to="
                        `/device-selection/${o.types[(t - 1) * colCount + c - 1].fdn()}.html`
                    ">
                        <img :src="imageObj[o.types[(t - 1) * colCount + c - 1]]" style="max-height: 8em;">
                    </router-link>
                </td>
            </tr>
        </table>
    </template>

    <p><router-link to="/device-list.html">{{ viewAllStr }}</router-link></p>

    <p>AppleDB is not affiliated with Apple Inc.</p>
</template>

<script>
import { usePageFrontmatter } from '@vuepress/client'
import { useDarkMode } from '@vuepress/theme-default/lib/client/composables'
import deviceTypeGroups from '@temp/deviceTypeGroups'

String.prototype.fdn = function() {
  return this
  .replace(/ /g, '-')
  .replace(/\//g,'%2F')
  .replace(/ü/g,'u')
  .replace(/²/g,'2')
  .replace(/³/g,'3')
}

export default {
    data() {
        return {
            introStr: [
                'Please select what kind of device you have below.'
            ],
            viewAllStr: 'View all devices',

            colCount: 3,
            frontmatter: usePageFrontmatter(),
            isDarkMode: useDarkMode()
        }
    },
    computed: {
        groupList() {
            return this.frontmatter.groupList
        },
        typeArr() {
            return Array.from(new Set(this.groupList.map(x => x.type)))
        },
        groupObj() {
            var presetTypeArr = []
            var presetOrder = deviceTypeGroups.map(x => {
                x.types = x.types.filter(y => this.typeArr.includes(y))
                for (const t of x.types) presetTypeArr.push(t)
                return x
            })

            const unsetTypes = this.typeArr.filter(x => !presetTypeArr.includes(x))
            if (unsetTypes.length > 0) presetOrder.push({
                label: "Other",
                types: unsetTypes
            })

            return presetOrder
        },
        devCount() {
            const groupList = this.groupList
            var tempTypeArr = []
            var ret = {}

            for (const g of groupList) {
                if (tempTypeArr.includes(g.type)) continue
                tempTypeArr.push(g.type)
                ret[g.type] = 0
            }

            for (const g of groupList) ret[g.type] += g.devices.length
            
            return ret
        },
        imageObj() {
            const groupList = this.groupList
            var tempTypeArr = []
            var firstDeviceObj = {}

            for (const g of groupList) {
                if (tempTypeArr.includes(g.type)) continue
                tempTypeArr.push(g.type)
                firstDeviceObj[g.type] = {
                    key: g.devices[0],
                    imageBool: g.img.count > 0,
                    dark: g.img.dark
                }
            }

            const overrides = { 
                iPhone: "iPhone14,2",
                AirPods: "AirPods1,1",
                "MacBook Pro": "MacBookPro18,1"
            }
            
            for (const o in overrides) {
                const group = groupList.filter(x => {
                    if (!x.key) return false
                    return x.key.includes(overrides[o])
                })[0]
                if (!group) continue
                firstDeviceObj[o] = {
                    key: group.devices[0],
                    imageBool: group.img.count > 0,
                    dark: group.img.dark
                }
            }

            var ret = {}
            for (const d in firstDeviceObj) ret[d] = firstDeviceObj[d].imageBool ? `https://img.appledb.dev/device@preview/${firstDeviceObj[d].key}/0${this.isDarkMode && firstDeviceObj[d].dark ? '_dark' : ''}.webp` : `/assets/images/logo${this.isDarkMode ? '_dark' : ''}.webp`
            
            return ret
        }
    }
}
</script>

<style scoped>
table {
    table-layout: fixed;
}

td, th {
    text-align: center;
}
</style>