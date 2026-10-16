/**
 * Every article, in display order: newest first.
 *
 * One JSON file per post sits beside this file. This list is the only place
 * order is decided, and it drives the /blog pages, the "related" picks and the
 * sitemap. Order is the array order below, never a sort: two posts can share a
 * date, and a sort would have to invent a tiebreak.
 *
 * Static imports, not a runtime fs read, so webpack bundles the posts and the
 * site never depends on src/ existing on the server.
 *
 * To add a post: `node scripts/new-post.mjs <slug>` writes the file and the two
 * lines here. See docs/adding-a-blog-post.md.
 */
import p_how_to_choose_a_mobile_app_developer_in_dubai from "./how-to-choose-a-mobile-app-developer-in-dubai.json";
import p_google_tag_manager_update_october_2026 from "./google-tag-manager-update-october-2026.json";
import p_what_to_track_in_marketing_uae from "./what-to-track-in-marketing-uae.json";
import p_your_landing_page_is_part_of_your_ad_spend from "./your-landing-page-is-part-of-your-ad-spend.json";
import p_cost_per_lead_is_fine_sales_team_unhappy from "./cost-per-lead-is-fine-sales-team-unhappy.json";
import p_how_much_should_a_dubai_business_spend_on_digital_marketing from "./how-much-should-a-dubai-business-spend-on-digital-marketing.json";
import p_google_ads_vs_meta_vs_tiktok_where_to_start_uae from "./google-ads-vs-meta-vs-tiktok-where-to-start-uae.json";
import p_real_estate_marketing_dubai_what_generates_enquiries from "./real-estate-marketing-dubai-what-generates-enquiries.json";
import p_how_to_tell_if_your_digital_marketing_is_working from "./how-to-tell-if-your-digital-marketing-is-working.json";
import p_why_your_leads_are_not_converting from "./why-your-leads-are-not-converting.json";
import p_snapchat_and_tiktok_ads_in_the_uae from "./snapchat-and-tiktok-ads-in-the-uae.json";
import p_what_does_a_web_developer_do from "./what-does-a-web-developer-do.json";
import p_web_developer_vs_web_designer from "./web-developer-vs-web-designer.json";
import p_full_stack_front_end_or_back_end_developer from "./full-stack-front-end-or-back-end-developer.json";
import p_cost_to_hire_a_web_developer_in_dubai from "./cost-to-hire-a-web-developer-in-dubai.json";
import p_ux_designer_vs_ui_designer from "./ux-designer-vs-ui-designer.json";
import p_what_is_a_product_designer from "./what-is-a-product-designer.json";
import p_what_a_ux_designer_actually_does from "./what-a-ux-designer-actually-does.json";
import p_freelance_designer_vs_design_agency from "./freelance-designer-vs-design-agency.json";
import p_what_is_mobile_app_development from "./what-is-mobile-app-development.json";
import p_native_vs_cross_platform_app_development from "./native-vs-cross-platform-app-development.json";
import p_what_does_a_mobile_developer_do from "./what-does-a-mobile-developer-do.json";
import p_questions_to_ask_a_web_developer_before_hiring from "./questions-to-ask-a-web-developer-before-hiring.json";
import p_best_crm_for_dubai_real_estate from "./best-crm-for-dubai-real-estate.json";
import p_wordpress_or_nextjs_for_your_business_website from "./wordpress-or-nextjs-for-your-business-website.json";
import p_google_ads_or_seo_which_first_dubai from "./google-ads-or-seo-which-first-dubai.json";
import p_freelance_digital_marketer_vs_agency_dubai from "./freelance-digital-marketer-vs-agency-dubai.json";
import p_google_ads_vs_meta_ads_dubai_real_estate from "./google-ads-vs-meta-ads-dubai-real-estate.json";
import p_how_much_does_a_website_cost_in_dubai from "./how-much-does-a-website-cost-in-dubai.json";
import p_react_useimperativehandle_hook_explained from "./react-useimperativehandle-hook-explained.json";
import p_react_usereducer_hook_explained from "./react-usereducer-hook-explained.json";
import p_react_usememo_hook_explained from "./react-usememo-hook-explained.json";
import p_react_usecallback_hook_explained from "./react-usecallback-hook-explained.json";
import p_react_useref_hook_explained_with_real_examples from "./react-useref-hook-explained-with-real-examples.json";
import p_react_built_in_hooks_vs_additional_hooks from "./react-built-in-hooks-vs-additional-hooks.json";
import p_react_usecontext_hook_explained from "./react-usecontext-hook-explained.json";
import p_react_usestate_hook_explained_with_examples from "./react-usestate-hook-explained-with-examples.json";
import p_react_useeffect_hook_explained_with_examples from "./react-useeffect-hook-explained-with-examples.json";
import p_top_10_javascript_array_methods from "./top-10-javascript-array-methods.json";
import p_react_state_management_usestate_vs_redux_vs_context from "./react-state-management-usestate-vs-redux-vs-context.json";
import p_react_native_flatlist_vs_scrollview from "./react-native-flatlist-vs-scrollview.json";
import p_how_javascript_developers_can_learn_typescript from "./how-javascript-developers-can-learn-typescript.json";
import p_learn_node_js_from_scratch from "./learn-node-js-from-scratch.json";
import p_10_reasons_why_node_js_is_the_best_choice from "./10-reasons-why-node-js-is-the-best-choice.json";
import p_master_redux_toolkit from "./master-redux-toolkit.json";
import p_master_javascript_string_methods from "./master-javascript-string-methods.json";
import p_5_must_know_react_component_patterns from "./5-must-know-react-component-patterns.json";
import p_7_javascript_concepts_to_learn_before_react from "./7-javascript-concepts-to-learn-before-react.json";
import p_master_infinite_scroll_in_javascript from "./master-infinite-scroll-in-javascript.json";
import p_react_hooks_explained from "./react-hooks-explained.json";
import p_javascript_console_methods from "./javascript-console-methods.json";
import p_javascript_es6_features_a_comprehensive_guide from "./javascript-es6-features-a-comprehensive-guide.json";
import p_structuring_your_react_app_like_a_pro from "./structuring-your-react-app-like-a-pro.json";
import p_react_tips_and_tricks_for_efficient_development from "./react-tips-and-tricks-for-efficient-development.json";
import p_5_ui_ux_design_trends_you_cant_ignore_in_2025 from "./5-ui-ux-design-trends-you-cant-ignore-in-2025.json";
import p_8_best_websites_for_design_inspiration from "./8-best-websites-for-design-inspiration.json";
import p_must_have_developer_tools_for_2025 from "./must-have-developer-tools-for-2025.json";
import p_websites_every_developer_must_bookmark from "./websites-every-developer-must-bookmark.json";
import p_ai_tools_every_creator_must_try_in_2025 from "./ai-tools-every-creator-must-try-in-2025.json";
import p_optimizing_react_applications_advanced_techniques from "./optimizing-react-applications-advanced-techniques.json";
import p_mastering_flexbox_in_css from "./mastering-flexbox-in-css.json";
import p_the_ultimate_css_cheat_sheet from "./the-ultimate-css-cheat-sheet.json";
import p_top_react_design_patterns from "./top-react-design-patterns.json";
import p_6_best_ai_powered_figma_plugins from "./6-best-ai-powered-figma-plugins.json";
import p_10_best_websites_to_master_ui_ux_design from "./10-best-websites-to-master-ui-ux-design.json";
import p_6_unique_powerful_figma_plugins from "./6-unique-powerful-figma-plugins.json";
import p_chatgpt_vs_deepseek_the_ultimate_ai_showdown from "./chatgpt-vs-deepseek-the-ultimate-ai-showdown.json";
import p_most_useful_react_hooks from "./most-useful-react-hooks.json";
import p_what_are_em_and_rem_units from "./what-are-em-and-rem-units.json";
import p_high_quality_free_design_resources from "./high-quality-free-design-resources.json";
import p_7_essential_css_websites_to_boost_productivity from "./7-essential-css-websites-to-boost-productivity.json";
import p_exploring_key_trends_in_modern_user_interfaces from "./exploring-key-trends-in-modern-user-interfaces.json";
import p_7_tips_to_improve_ctr_click_through_rate from "./7-tips-to-improve-ctr-click-through-rate.json";
import p_top_10_productivity_tools_to_boost_efficiency from "./top-10-productivity-tools-to-boost-efficiency.json";
import p_exploring_react_19_hooks from "./exploring-react-19-hooks.json";
import p_the_ultimate_guide_to_javascript_web_apis from "./the-ultimate-guide-to-javascript-web-apis.json";
import p_typescript_guide_for_javascript_programmers from "./typescript-guide-for-javascript-programmers.json";
import p_8_must_have_free_icon_libraries_for_designers from "./8-must-have-free-icon-libraries-for-designers.json";
import p_redux_made_easy_beginners_guide_to_state_management_in_react_js from "./redux-made-easy-beginners-guide-to-state-management-in-react-js.json";
import p_react_js_state_management_for_beginners from "./react-js-state-management-for-beginners.json";

/** Untyped here; `src/data/blogPosts.ts` applies the `BlogPost` type. */
export const postsInOrder = [
  p_how_to_choose_a_mobile_app_developer_in_dubai,
  p_google_tag_manager_update_october_2026,
  p_what_to_track_in_marketing_uae,
  p_your_landing_page_is_part_of_your_ad_spend,
  p_cost_per_lead_is_fine_sales_team_unhappy,
  p_how_much_should_a_dubai_business_spend_on_digital_marketing,
  p_google_ads_vs_meta_vs_tiktok_where_to_start_uae,
  p_real_estate_marketing_dubai_what_generates_enquiries,
  p_how_to_tell_if_your_digital_marketing_is_working,
  p_why_your_leads_are_not_converting,
  p_snapchat_and_tiktok_ads_in_the_uae,
  p_what_does_a_web_developer_do,
  p_web_developer_vs_web_designer,
  p_full_stack_front_end_or_back_end_developer,
  p_cost_to_hire_a_web_developer_in_dubai,
  p_ux_designer_vs_ui_designer,
  p_what_is_a_product_designer,
  p_what_a_ux_designer_actually_does,
  p_freelance_designer_vs_design_agency,
  p_what_is_mobile_app_development,
  p_native_vs_cross_platform_app_development,
  p_what_does_a_mobile_developer_do,
  p_questions_to_ask_a_web_developer_before_hiring,
  p_best_crm_for_dubai_real_estate,
  p_wordpress_or_nextjs_for_your_business_website,
  p_google_ads_or_seo_which_first_dubai,
  p_freelance_digital_marketer_vs_agency_dubai,
  p_google_ads_vs_meta_ads_dubai_real_estate,
  p_how_much_does_a_website_cost_in_dubai,
  p_react_useimperativehandle_hook_explained,
  p_react_usereducer_hook_explained,
  p_react_usememo_hook_explained,
  p_react_usecallback_hook_explained,
  p_react_useref_hook_explained_with_real_examples,
  p_react_built_in_hooks_vs_additional_hooks,
  p_react_usecontext_hook_explained,
  p_react_usestate_hook_explained_with_examples,
  p_react_useeffect_hook_explained_with_examples,
  p_top_10_javascript_array_methods,
  p_react_state_management_usestate_vs_redux_vs_context,
  p_react_native_flatlist_vs_scrollview,
  p_how_javascript_developers_can_learn_typescript,
  p_learn_node_js_from_scratch,
  p_10_reasons_why_node_js_is_the_best_choice,
  p_master_redux_toolkit,
  p_master_javascript_string_methods,
  p_5_must_know_react_component_patterns,
  p_7_javascript_concepts_to_learn_before_react,
  p_master_infinite_scroll_in_javascript,
  p_react_hooks_explained,
  p_javascript_console_methods,
  p_javascript_es6_features_a_comprehensive_guide,
  p_structuring_your_react_app_like_a_pro,
  p_react_tips_and_tricks_for_efficient_development,
  p_5_ui_ux_design_trends_you_cant_ignore_in_2025,
  p_8_best_websites_for_design_inspiration,
  p_must_have_developer_tools_for_2025,
  p_websites_every_developer_must_bookmark,
  p_ai_tools_every_creator_must_try_in_2025,
  p_optimizing_react_applications_advanced_techniques,
  p_mastering_flexbox_in_css,
  p_the_ultimate_css_cheat_sheet,
  p_top_react_design_patterns,
  p_6_best_ai_powered_figma_plugins,
  p_10_best_websites_to_master_ui_ux_design,
  p_6_unique_powerful_figma_plugins,
  p_chatgpt_vs_deepseek_the_ultimate_ai_showdown,
  p_most_useful_react_hooks,
  p_what_are_em_and_rem_units,
  p_high_quality_free_design_resources,
  p_7_essential_css_websites_to_boost_productivity,
  p_exploring_key_trends_in_modern_user_interfaces,
  p_7_tips_to_improve_ctr_click_through_rate,
  p_top_10_productivity_tools_to_boost_efficiency,
  p_exploring_react_19_hooks,
  p_the_ultimate_guide_to_javascript_web_apis,
  p_typescript_guide_for_javascript_programmers,
  p_8_must_have_free_icon_libraries_for_designers,
  p_redux_made_easy_beginners_guide_to_state_management_in_react_js,
  p_react_js_state_management_for_beginners,
];
