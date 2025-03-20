import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance, { updateAxiosToken } from "../api/axios";
import Cookies from "js-cookie";

type AuthErrors = {
  name?: string[];
  email?: string[];
  password?: string[];
};

type LoginParams = {
  email: string;
  password: string;
  "g-recaptcha-response"?: string;
};

type RegisterParams = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  "g-recaptcha-response"?: string;
};

type NewPasswordParams = {
  email: string;
  token: string | undefined;
  password: string;
  password_confirmation: string;
};

type Timezone = {
  value: string;
  label: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  avatar?:
    | {
        src: string;
        height: number;
        width: number;
      }
    | string;
  timezone?: string;
  balance?: string;
  notif_tg?: boolean;
  notif_deadline?: boolean;
  notif_articles?: boolean;
  notif_guides?: boolean;
  notif_change?: boolean;
  lang?: string;
  affiliate_id?: string;
  count_views?: number;
  free_views?: number;
};

type Plan = {
  id: number;
  name: string;
  count_days: number;
  price: string;
  price_month: string | null;
  sort: number;
};

type Subscription = {
  date_start: string;
  date_end: string;
  price: string;
  name: string;
};

type SubscriptionsResponse = {
  current_page: number;
  data: Subscription[];
  first_page_url: string;
  from: number;
  next_page_url: string | null;
  path: string;
  per_page: string;
  prev_page_url: string | null;
  to: number;
};

type ReferralUser = {
  id: number;
  email: string;
  avatar: string;
  name: string;
};

type ReferralTransaction = {
  id: number;
  sum: string;
  referal_id: number;
  date: string;
  referal: ReferralUser;
};

type ReferralsResponse = {
  limit_referals: number;
  referrals_count: number;
  profit: string;
  rewards: number;
  referal_link: string;
  transactions: {
    current_page: number;
    data: ReferralTransaction[];
    first_page_url: string;
    from: number;
    next_page_url: string | null;
    path: string;
    per_page: string;
    prev_page_url: string | null;
    to: number;
  };
};

type TagName = {
  en: string;
  ru: string;
};

type Tag = {
  id: number;
  name: TagName;
  sort: number;
};

type Icon = {
  id: number;
  path: string;
};

type Marker = {
  id: number;
  title: string;
  icon_id: number | null;
  highlighted: boolean;
  pivot: {
    project_id: number;
    marker_id: number;
  };
  icon: Icon | null;
};

type Task = {
  id: number;
  project_id: number;
  title: string;
  time: number;
  completed: number;
};

type GuideDetails = {
  id: number;
  tag_id: number;
  title: string;
  slug: string;
  time: number;
  description: string;
  description_full?: string;
  evaluation: number;
  tvl: string;
  investments: string;
  logo: string;
  created_at: string;
  tasks_count: number;
  competed_tasks_count: number;
  favorite: number;
  created: string;
  markers: Marker[];
  tasks: Task[];
  link_site: string | null;
  link_telegram: string | null;
  link_x: string | null;
};

type TaskDetails = {
  content: string;
};

type Guide = {
  id: number;
  tag_id: number | null;
  title: string;
  slug: string;
  time: number;
  description: string;
  evaluation: number;
  tvl: string;
  investments: string;
  logo: string;
  tasks_count: number;
  competed_tasks_count: number;
  favorite: number;
  updated: string;
  markers: Marker[];
};

type GuidesResponse = {
  current_page: number;
  data: Guide[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

type GuidesParams = {
  page?: number;
  tag_id?: number;
  search?: string;
  favorites?: boolean;
  sorting?: 1 | 2;
};

type Coupon = {
  sale: string;
  perc: boolean;
};

type CouponResponse = {
  type: string;
  coupon?: Coupon;
  message?: string;
};

type ErrorResponse = {
  status?: number;
  data?: {
    message?: string;
    errors?: {
      code?: string[];
    };
  };
};

type BuyPlanResponse = {
  type: string;
  message: string;
};

type BlogCategory = {
  id: number;
  title: string;
  sort: number;
};

type BlogArticleCategory = {
  id: number;
  title: string;
};

type BlogArticle = {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  img: string;
  reading_time: number;
  description: string;
  read: number;
  updated: string;
  category: BlogArticleCategory;
};

type BlogArticlesResponse = {
  current_page: number;
  data: BlogArticle[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

type BlogArticlesParams = {
  page?: number;
  category_id?: number;
  search?: string;
  sorting?: 1 | 2;
};

type BlogArticleDetails = {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  description: string;
  img: string;
  reading_time: number;
  updated_at: string;
  read: number;
  updated: string;
  category: BlogArticleCategory;
};

type ProductCategory = {
  id: number;
  title: string;
  sort: number;
};

type ProductCategoryResponse = ProductCategory[];

type Product = {
  id: number;
  product_category_id: number;
  title: string;
  slug: string;
  img: string;
  price: number;
  description: string;
  updated: string;
  product_category: {
    id: number;
    title: string;
  };
};

type ProductsResponse = {
  current_page: number;
  data: Product[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

type ProductsParams = {
  page?: number;
  product_category_id?: number;
  search?: string;
  sorting?: 1 | 2;
};

type ProductDetails = {
  id: number;
  product_category_id: number;
  title: string;
  slug: string;
  description: string;
  img: string;
  price: number;
  updated_at: string;
  updated: string;
  product_category: {
    id: number;
    title: string;
  };
};

type OrderCreateParams = {
  telegram: string;
  message: string;
  product_id: number;
};

type OrderCreateResponse = {
  type: string;
  status: string;
};

type Subaccount = {
  id: number;
  email: string;
  avatar: string;
  name: string;
  created_at: string;
};

type SubaccountsData = {
  current_page: number;
  data: Subaccount[];
  first_page_url: string;
  from: number;
  next_page_url: string | null;
  path: string;
  per_page: string;
  prev_page_url: string | null;
  to: number;
};

type SubaccountsResponse = {
  limit_subaccounts: number;
  subaccounts_count: number;
  subaccounts_link: string;
  subaccounts: SubaccountsData;
};

type UpdateUserParams = {
  name?: string;
  timezone?: string;
  notif_tg?: boolean;
  notif_deadline?: boolean;
  notif_articles?: boolean;
  notif_guides?: boolean;
  notif_change?: boolean;
  avatar?: File;
  lang?: string;
};

type NotificationIcon = {
  id: number;
  path: string;
};

type Notification = {
  id: number;
  seen: number;
  text: string;
  icon: NotificationIcon | null;
};

type NotificationsResponse = {
  current_page: number;
  data: Notification[];
  first_page_url: string;
  from: number;
  next_page_url: string | null;
  path: string;
  per_page: string;
  prev_page_url: string | null;
  to: number;
};

type StoreState = {
  timezones: Timezone[];
  selectedTimezone: string;
  user: User | null;
  paymentRedirectUrl: string | null;
  error: string | null;
  plans: Plan[];
  isLoadingPlans: boolean;
  plansFetchError: string | null;
  coupon: Coupon | null;
  isCouponLoading: boolean;
  couponError: string | null;
  isBuyingPlan: boolean;
  buyPlanError: string | null;
  buyPlanSuccess: string | null;
  subscriptions: Subscription[];
  isLoadingSubscriptions: boolean;
  subscriptionsError: string | null;
  referrals: ReferralsResponse | null;
  isLoadingReferrals: boolean;
  referralsError: string | null;
  tags: Tag[];
  isLoadingTags: boolean;
  tagsError: string | null;
  guides: GuidesResponse | null;
  isLoadingGuides: boolean;
  guidesError: string | null;
  guideDetails: GuideDetails | null;
  isLoadingGuideDetails: boolean;
  guideDetailsError: string | null;
  taskDetails: TaskDetails | null;
  isLoadingTaskDetails: boolean;
  taskDetailsError: string | null;
  blogCategories: BlogCategory[];
  isLoadingBlogCategories: boolean;
  blogCategoriesError: string | null;
  blogArticles: BlogArticlesResponse | null;
  isLoadingBlogArticles: boolean;
  blogArticlesError: string | null;
  blogArticleDetails: BlogArticleDetails | null;
  isLoadingBlogArticleDetails: boolean;
  blogArticleDetailsError: string | null;
  productCategories: ProductCategory[];
  isLoadingProductCategories: boolean;
  productCategoriesError: string | null;
  products: ProductsResponse | null;
  isLoadingProducts: boolean;
  productsError: string | null;
  productDetails: ProductDetails | null;
  isLoadingProductDetails: boolean;
  productDetailsError: string | null;
  isCreatingOrder: boolean;
  orderCreateSuccess: string | null;
  orderCreateError: string | null;
  subaccounts: SubaccountsResponse | null;
  isLoadingSubaccounts: boolean;
  subaccountsError: string | null;
  isUpdatingUser: boolean;
  updateUserSuccess: string | null;
  updateUserError: string | null;
  notifications: NotificationsResponse | null;
  isLoadingNotifications: boolean;
  notificationsError: string | null;
  fetchTimezones: () => Promise<void>;
  updateUser: (updateData: UpdateUserParams) => Promise<boolean>;
  deleteUser: () => Promise<void>;
  payWithYookassa: (amount: number) => Promise<void>;
  payWithNowPayments: (amount: number) => Promise<void>;
  setSelectedTimezone: (timezone: string) => void;
  changePassword: (
    oldPassword: string,
    newPassword: string,
    passwordConfirmation: string,
  ) => Promise<void>;
  fetchPlans: () => Promise<void>;
  checkCoupon: (code: string) => Promise<Coupon | null>;
  clearCoupon: () => void;
  buyPlan: (planId: number, couponCode?: string) => Promise<boolean>;
  resetBuyPlanState: () => void;
  fetchSubscriptions: () => Promise<void>;
  fetchReferrals: () => Promise<void>;
  fetchTags: () => Promise<void>;
  fetchGuides: (params?: GuidesParams) => Promise<void>;
  fetchGuideDetails: (idOrSlug: string | number) => Promise<void>;
  fetchTaskDetails: (taskId: number) => Promise<void>;
  toggleFavorite: (guideId: number) => Promise<boolean>;
  toggleTaskComplete: (taskId: number) => Promise<boolean>;
  fetchBlogCategories: () => Promise<void>;
  fetchBlogArticles: (params?: BlogArticlesParams) => Promise<void>;
  fetchBlogArticleDetails: (idOrSlug: string | number) => Promise<void>;
  toggleRead: (articleId: number) => Promise<boolean>;
  fetchProductCategories: () => Promise<void>;
  fetchProducts: (params?: ProductsParams) => Promise<void>;
  fetchProductDetails: (idOrSlug: string | number) => Promise<void>;
  createOrder: (params: OrderCreateParams) => Promise<boolean>;
  resetOrderState: () => void;
  fetchSubaccounts: (page?: number) => Promise<void>;
  resetUpdateUserState: () => void;
  authErrors: AuthErrors;
  authLoading: boolean;
  authStatus: string | null;
  sessionVerified: boolean;
  login: (data: LoginParams) => Promise<{ token: string }>;
  register: (data: RegisterParams) => Promise<{ token: string }>;
  logout: () => Promise<void>;
  sendPasswordResetLink: (data: {
    email: string;
  }) => Promise<{ status: string }>;
  newPassword: (data: NewPasswordParams) => Promise<{ status: string }>;
  sendEmailVerificationLink: () => Promise<{ status: string }>;
  setAuthStatus: (status: string | null) => void;
  fetchNotifications: (page?: number) => Promise<void>;
  refreshUser: () => Promise<boolean>;
};

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      timezones: [],
      selectedTimezone: "Select your timezone",
      user: null,
      paymentRedirectUrl: null,
      error: null,
      plans: [],
      isLoadingPlans: false,
      plansFetchError: null,
      coupon: null,
      isCouponLoading: false,
      couponError: null,
      isBuyingPlan: false,
      buyPlanError: null,
      buyPlanSuccess: null,
      subscriptions: [],
      isLoadingSubscriptions: false,
      subscriptionsError: null,
      referrals: null,
      isLoadingReferrals: false,
      referralsError: null,
      tags: [],
      isLoadingTags: false,
      tagsError: null,
      guides: null,
      isLoadingGuides: false,
      guidesError: null,
      guideDetails: null,
      isLoadingGuideDetails: false,
      guideDetailsError: null,
      taskDetails: null,
      isLoadingTaskDetails: false,
      taskDetailsError: null,
      blogCategories: [],
      isLoadingBlogCategories: false,
      blogCategoriesError: null,
      blogArticles: null,
      isLoadingBlogArticles: false,
      blogArticlesError: null,
      blogArticleDetails: null,
      isLoadingBlogArticleDetails: false,
      blogArticleDetailsError: null,
      productCategories: [],
      isLoadingProductCategories: false,
      productCategoriesError: null,
      products: null,
      isLoadingProducts: false,
      productsError: null,
      productDetails: null,
      isLoadingProductDetails: false,
      productDetailsError: null,
      isCreatingOrder: false,
      orderCreateSuccess: null,
      orderCreateError: null,
      subaccounts: null,
      isLoadingSubaccounts: false,
      subaccountsError: null,
      isUpdatingUser: false,
      updateUserSuccess: null,
      updateUserError: null,
      notifications: null,
      isLoadingNotifications: false,
      notificationsError: null,
      authErrors: {},
      authLoading: false,
      authStatus: null,
      sessionVerified: false,

      setSelectedTimezone: (timezone: string) => {
        set({ selectedTimezone: timezone });
      },

      fetchTimezones: async () => {
        try {
          const response = await axiosInstance.get("/api/timezones");

          let timezoneData: Timezone[] = [];

          if (Array.isArray(response.data)) {
            timezoneData = response.data.map(
              (tz: string | { value: string; label: string }) => ({
                value: typeof tz === "string" ? tz : tz.value,
                label: typeof tz === "string" ? tz : tz.label,
              }),
            );
          } else if (
            typeof response.data === "object" &&
            response.data !== null
          ) {
            timezoneData = Object.entries(response.data).map(
              ([value, label]) => ({
                value,
                label: label as string,
              }),
            );
          }

          if (typeof window !== "undefined") {
            const savedTimezone = localStorage.getItem("selectedTimezone");
            if (savedTimezone && savedTimezone !== "Select your timezone") {
              set({
                timezones: timezoneData,
                selectedTimezone: savedTimezone,
                error: null,
              });
            } else {
              set({ timezones: timezoneData, error: null });
            }
          } else {
            set({ timezones: timezoneData, error: null });
          }

          const token = Cookies.get("auth-token");
          if (token) {
            try {
              const { data } = await axiosInstance.get<User>("/api/user", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              set({ user: data, sessionVerified: true });
              updateAxiosToken(token);
            } catch (e) {
              console.warn("Error fetching user:", e);
              set({ sessionVerified: false, user: null });
              updateAxiosToken(null);
              Cookies.remove("auth-token");
            }
          } else {
            set({ sessionVerified: false, user: null });
          }
        } catch (error) {
          console.error("Error fetching timezones:", error);
          set({
            error: error instanceof Error ? error.message : "An error occurred",
          });
        }
      },

      updateUser: async (updateData: UpdateUserParams) => {
        try {
          set({
            isUpdatingUser: true,
            updateUserSuccess: null,
            updateUserError: null,
          });

          if (updateData.avatar) {
            const formData = new FormData();

            formData.append("avatar", updateData.avatar);

            await axiosInstance.post<User>("/api/user/update", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
          }

          const dataToSend: {
            name?: string;
            timezone?: string;
            notif_tg?: string;
            notif_deadline?: string;
            notif_articles?: string;
            notif_guides?: string;
            notif_change?: string;
            lang?: string;
          } = {};

          if (updateData.name !== undefined) {
            dataToSend.name = updateData.name;
          }

          if (updateData.timezone !== undefined) {
            dataToSend.timezone = updateData.timezone;
          }

          if (updateData.notif_tg !== undefined) {
            dataToSend.notif_tg = updateData.notif_tg ? "1" : "0";
          }

          if (updateData.notif_deadline !== undefined) {
            dataToSend.notif_deadline = updateData.notif_deadline ? "1" : "0";
          }

          if (updateData.notif_articles !== undefined) {
            dataToSend.notif_articles = updateData.notif_articles ? "1" : "0";
          }

          if (updateData.notif_guides !== undefined) {
            dataToSend.notif_guides = updateData.notif_guides ? "1" : "0";
          }

          if (updateData.notif_change !== undefined) {
            dataToSend.notif_change = updateData.notif_change ? "1" : "0";
          }

          if (updateData.lang !== undefined) {
            dataToSend.lang = updateData.lang;
          }

          if (Object.keys(dataToSend).length > 0) {
            await axiosInstance.post<User>("/api/user/update", dataToSend, {
              headers: {
                "Content-Type": "application/json",
              },
            });
          }

          const currentUser = get().user;
          if (currentUser) {
            const { data: userData } =
              await axiosInstance.get<User>("/api/user");
            set({
              user: { ...currentUser, ...userData },
              isUpdatingUser: false,
              updateUserSuccess: "Profile updated successfully",
              updateUserError: null,
            });
          }

          return true;
        } catch (error) {
          console.error("Error updating user:", error);
          let errorMessage = "Failed to update profile";

          if (error && typeof error === "object" && "response" in error) {
            const errorResponse = error.response as ErrorResponse;
            if (errorResponse?.status === 422) {
              if (errorResponse.data?.message) {
                errorMessage = errorResponse.data.message;
              } else if (errorResponse.data?.errors) {
                const errors = Object.values(errorResponse.data.errors).flat();
                errorMessage = errors.join(", ");
              }
            } else if (errorResponse?.data?.message) {
              errorMessage = errorResponse.data.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            isUpdatingUser: false,
            updateUserSuccess: null,
            updateUserError: errorMessage,
          });
          return false;
        }
      },

      resetUpdateUserState: () => {
        set({
          isUpdatingUser: false,
          updateUserSuccess: null,
          updateUserError: null,
        });
      },

      deleteUser: async () => {
        try {
          await axiosInstance.post("/api/user/delete");
          Cookies.remove("auth-token");
          set({ user: null });
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      },

      payWithYookassa: async (amount: number) => {
        try {
          const response = await axiosInstance.post(
            "/api/payments/yookassa/pay",
            {
              amount,
            },
          );

          set({
            paymentRedirectUrl: (response.data as { redirect_url: string })
              .redirect_url,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
          });
        }
      },

      payWithNowPayments: async (amount: number) => {
        try {
          const response = await axiosInstance.post(
            "/api/payments/nowpayments/pay",
            {
              amount,
            },
          );

          set({
            paymentRedirectUrl: (response.data as { redirect_url: string })
              .redirect_url,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
          });
        }
      },

      changePassword: async (
        oldPassword: string,
        newPassword: string,
        passwordConfirmation: string,
      ) => {
        try {
          await axiosInstance.post("/api/user/change-password", {
            old_password: oldPassword,
            password: newPassword,
            password_confirmation: passwordConfirmation,
          });
          set({ error: null });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
          });
          throw error;
        }
      },

      fetchPlans: async () => {
        try {
          set({ isLoadingPlans: true, plansFetchError: null });
          const response = await axiosInstance.get<Plan[]>("/api/plans");
          const sortedPlans = response.data.sort((a, b) => a.sort - b.sort);
          set({
            plans: sortedPlans,
            isLoadingPlans: false,
            plansFetchError: null,
          });
        } catch (error) {
          console.error("Error fetching plans:", error);
          set({
            plansFetchError: "Failed to load plans. Please try again later.",
            isLoadingPlans: false,
          });
        }
      },

      checkCoupon: async (code: string) => {
        try {
          set({ isCouponLoading: true, couponError: null });

          const response = await axiosInstance.post<CouponResponse>(
            "/api/coupon/check",
            {
              code,
            },
          );

          if (response.data.type === "success" && response.data.coupon) {
            const coupon: Coupon = response.data.coupon;
            set({ coupon, isCouponLoading: false });
            return coupon;
          }

          set({ isCouponLoading: false, coupon: null });
          return null;
        } catch (error: unknown) {
          let errorMessage = "Failed to check coupon";

          if (error && typeof error === "object" && "response" in error) {
            const errorResponse = error.response as ErrorResponse;
            if (errorResponse?.status === 400) {
              errorMessage =
                errorResponse.data?.message || "Coupon is not valid.";
            } else if (errorResponse?.status === 422) {
              errorMessage =
                errorResponse.data?.errors?.code?.[0] ||
                errorResponse.data?.message ||
                "Invalid coupon format.";
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            couponError: errorMessage,
            isCouponLoading: false,
            coupon: null,
          });
          return null;
        }
      },

      clearCoupon: () => {
        set({ coupon: null, couponError: null });
      },

      buyPlan: async (planId: number, couponCode?: string) => {
        try {
          set({
            isBuyingPlan: true,
            buyPlanError: null,
            buyPlanSuccess: null,
          });

          const payload: Record<string, string> = {};
          if (couponCode) {
            payload.code = couponCode;
          }

          const response = await axiosInstance.post<BuyPlanResponse>(
            `/api/plans/buy/${planId}`,
            payload,
          );

          if (response.data.type === "success") {
            set({
              isBuyingPlan: false,
              buyPlanSuccess: response.data.message,
              coupon: null,
            });
            return true;
          }

          set({
            isBuyingPlan: false,
            buyPlanError: "An unexpected error occurred",
          });
          return false;
        } catch (error: unknown) {
          let errorMessage = "Failed to purchase plan";

          if (error && typeof error === "object" && "response" in error) {
            const errorResponse = error.response as ErrorResponse;
            if (errorResponse?.status === 400) {
              errorMessage =
                errorResponse.data?.message || "Failed to purchase plan";
            } else if (errorResponse?.status === 422) {
              errorMessage =
                errorResponse.data?.errors?.code?.[0] ||
                errorResponse.data?.message ||
                "Validation error";
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            isBuyingPlan: false,
            buyPlanError: errorMessage,
          });
          return false;
        }
      },

      resetBuyPlanState: () => {
        set({
          isBuyingPlan: false,
          buyPlanError: null,
          buyPlanSuccess: null,
        });
      },

      fetchSubscriptions: async () => {
        try {
          set({
            isLoadingSubscriptions: true,
            subscriptionsError: null,
          });

          const response = await axiosInstance.get<SubscriptionsResponse>(
            "/api/user/subscriptions",
          );

          set({
            subscriptions: response.data.data,
            isLoadingSubscriptions: false,
            subscriptionsError: null,
          });
        } catch (error) {
          console.error("Error fetching subscriptions:", error);
          let errorMessage = "Failed to load subscriptions";

          if (error && typeof error === "object" && "response" in error) {
            const errorResponse = error.response as ErrorResponse;
            if (errorResponse?.data?.message) {
              errorMessage = errorResponse.data.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            subscriptionsError: errorMessage,
            isLoadingSubscriptions: false,
          });
        }
      },

      fetchReferrals: async () => {
        try {
          set({ isLoadingReferrals: true, referralsError: null });

          const response = await axiosInstance.get<ReferralsResponse>(
            "/api/user/referrals",
          );

          set({
            referrals: response.data,
            isLoadingReferrals: false,
            referralsError: null,
          });
        } catch (error) {
          console.error("Error fetching referrals:", error);
          let errorMessage = "Failed to load referrals";

          if (error && typeof error === "object" && "response" in error) {
            const errorResponse = error.response as ErrorResponse;
            if (errorResponse?.data?.message) {
              errorMessage = errorResponse.data.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            referralsError: errorMessage,
            isLoadingReferrals: false,
          });
        }
      },

      fetchTags: async () => {
        try {
          set({ isLoadingTags: true, tagsError: null });

          const response = await axiosInstance.get<Tag[]>("/api/tags");

          const sortedTags = response.data.sort((a, b) => a.sort - b.sort);

          set({
            tags: sortedTags,
            isLoadingTags: false,
            tagsError: null,
          });
        } catch (error) {
          console.error("Error fetching tags:", error);
          let errorMessage = "Failed to load tags";

          if (error && typeof error === "object" && "response" in error) {
            const errorResponse = error.response as ErrorResponse;
            if (errorResponse?.data?.message) {
              errorMessage = errorResponse.data.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            tagsError: errorMessage,
            isLoadingTags: false,
          });
        }
      },

      fetchGuides: async (params?: GuidesParams) => {
        try {
          set({ isLoadingGuides: true, guidesError: null });

          const queryParams = new URLSearchParams();
          if (params) {
            if (params.page) queryParams.append("page", params.page.toString());
            if (params.tag_id)
              queryParams.append("tag_id", params.tag_id.toString());
            if (params.search) queryParams.append("search", params.search);
            if (params.favorites !== undefined)
              queryParams.append("favorites", params.favorites.toString());
            if (params.sorting)
              queryParams.append("sorting", params.sorting.toString());
          }

          const queryString = queryParams.toString();
          const url = `/api/projects${queryString ? `?${queryString}` : ""}`;

          const response = await axiosInstance.get<GuidesResponse>(url);

          set({
            guides: response.data,
            isLoadingGuides: false,
            guidesError: null,
          });
        } catch (error) {
          console.error("Error fetching guides:", error);
          let errorMessage = "Failed to load guides";

          if (error && typeof error === "object" && "response" in error) {
            const errorResponse = error.response as ErrorResponse;
            if (errorResponse?.data?.message) {
              errorMessage = errorResponse.data.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            guidesError: errorMessage,
            isLoadingGuides: false,
          });
        }
      },

      fetchGuideDetails: async (idOrSlug: string | number) => {
        set({ isLoadingGuideDetails: true, guideDetailsError: null });
        try {
          const response = await axiosInstance.get<GuideDetails>(
            `/api/projects/show/${idOrSlug}`,
            {
              withCredentials: true,
            },
          );
          set({
            guideDetails: response.data,
            isLoadingGuideDetails: false,
          });
        } catch (error) {
          set({
            guideDetailsError: error as string,
            isLoadingGuideDetails: false,
          });
        }
      },

      refreshUser: async () => {
        try {
          set({
            isUpdatingUser: true,
            updateUserSuccess: null,
            updateUserError: null,
          });

          const currentUser = get().user;
          if (currentUser) {
            const { data: userData } =
              await axiosInstance.get<User>("/api/user");
            set({
              user: { ...currentUser, ...userData },
              isUpdatingUser: false,
              updateUserSuccess: "User refreshed successfully",
              updateUserError: null,
            });
          }

          return true;
        } catch (error) {
          console.error("Error refreshing user:", error);
          let errorMessage = "Failed to refresh profile";

          if (error && typeof error === "object" && "response" in error) {
            const errorResponse = error.response as ErrorResponse;
            if (errorResponse?.status === 422) {
              if (errorResponse.data?.message) {
                errorMessage = errorResponse.data.message;
              } else if (errorResponse.data?.errors) {
                const errors = Object.values(errorResponse.data.errors).flat();
                errorMessage = errors.join(", ");
              }
            } else if (errorResponse?.data?.message) {
              errorMessage = errorResponse.data.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            isUpdatingUser: false,
            updateUserSuccess: null,
            updateUserError: errorMessage,
          });
          return false;
        }
      },

      fetchTaskDetails: async (taskId: number) => {
        set({ isLoadingTaskDetails: true, taskDetailsError: null });
        try {
          const response = await axiosInstance.get<TaskDetails>(
            `/api/tasks/show/${taskId}`,
            {
              withCredentials: true,
            },
          );

          await get().refreshUser();

          set({
            taskDetails: response.data,
            isLoadingTaskDetails: false,
          });
        } catch (error) {
          set({
            taskDetailsError: error as string,
            isLoadingTaskDetails: false,
          });
        }
      },

      toggleFavorite: async (guideId: number) => {
        try {
          const currentGuides = get().guides;
          if (currentGuides) {
            const updatedGuides = {
              ...currentGuides,
              data: currentGuides.data.map((guide) => {
                if (guide.id === guideId) {
                  return {
                    ...guide,
                    favorite: guide.favorite > 0 ? 0 : 1,
                  };
                }
                return guide;
              }),
            };
            set({ guides: updatedGuides });
          }

          await axiosInstance.post(`/api/projects/favorite/${guideId}`);

          return true;
        } catch (error) {
          console.error("Error toggling favorite:", error);

          const currentGuides = get().guides;
          if (currentGuides) {
            const revertedGuides = {
              ...currentGuides,
              data: currentGuides.data.map((guide) => {
                if (guide.id === guideId) {
                  return {
                    ...guide,
                    favorite: guide.favorite > 0 ? 0 : 1,
                  };
                }
                return guide;
              }),
            };
            set({ guides: revertedGuides });
          }

          return false;
        }
      },

      toggleTaskComplete: async (taskId: number) => {
        try {
          const currentGuideDetails = get().guideDetails;

          if (currentGuideDetails) {
            const updatedTasks = currentGuideDetails.tasks.map((task) => {
              if (task.id === taskId) {
                return {
                  ...task,
                  completed: task.completed > 0 ? 0 : 1,
                };
              }
              return task;
            });

            const isCompleting =
              currentGuideDetails.tasks.find((task) => task.id === taskId)
                ?.completed === 0;

            set({
              guideDetails: {
                ...currentGuideDetails,
                tasks: updatedTasks,
                competed_tasks_count: isCompleting
                  ? currentGuideDetails.competed_tasks_count + 1
                  : currentGuideDetails.competed_tasks_count - 1,
              },
            });
          }

          await axiosInstance.post(
            `/api/tasks/complete/${taskId}`,
            {},
            {
              withCredentials: true,
            },
          );

          return true;
        } catch (error) {
          console.error("Error toggling task complete:", error);
          const currentGuideDetails = get().guideDetails;

          if (currentGuideDetails) {
            const revertedTasks = currentGuideDetails.tasks.map((task) => {
              if (task.id === taskId) {
                return {
                  ...task,
                  completed: task.completed > 0 ? 0 : 1,
                };
              }
              return task;
            });
            const wasCompleting =
              currentGuideDetails.tasks?.find((task) => task.id === taskId)
                ?.completed === 0;

            set({
              guideDetails: {
                ...currentGuideDetails,
                tasks: revertedTasks,
                competed_tasks_count: wasCompleting
                  ? currentGuideDetails.competed_tasks_count + 1
                  : currentGuideDetails.competed_tasks_count - 1,
              },
            });
          }

          return false;
        }
      },

      fetchBlogCategories: async () => {
        try {
          set({
            isLoadingBlogCategories: true,
            blogCategoriesError: null,
          });

          const response =
            await axiosInstance.get<BlogCategory[]>("/api/categories");

          const sortedCategories = response.data.sort(
            (a, b) => a.sort - b.sort,
          );

          set({
            blogCategories: sortedCategories,
            isLoadingBlogCategories: false,
            blogCategoriesError: null,
          });
        } catch (error) {
          console.error("Error fetching blog categories:", error);
          let errorMessage = "Failed to load blog categories";

          if (error && typeof error === "object" && "response" in error) {
            const errorResponse = error.response as ErrorResponse;
            if (errorResponse?.data?.message) {
              errorMessage = errorResponse.data.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            blogCategoriesError: errorMessage,
            isLoadingBlogCategories: false,
          });
        }
      },

      fetchBlogArticles: async (params?: BlogArticlesParams) => {
        try {
          set({
            isLoadingBlogArticles: true,
            blogArticlesError: null,
          });

          const queryParams = new URLSearchParams();
          if (params) {
            if (params.page) queryParams.append("page", params.page.toString());
            if (params.category_id)
              queryParams.append("category_id", params.category_id.toString());
            if (params.search) queryParams.append("search", params.search);
            if (params.sorting)
              queryParams.append("sorting", params.sorting.toString());
          }

          const queryString = queryParams.toString();
          const url = `/api/articles${queryString ? `?${queryString}` : ""}`;

          const response = await axiosInstance.get<BlogArticlesResponse>(url);

          set({
            blogArticles: response.data,
            isLoadingBlogArticles: false,
            blogArticlesError: null,
          });
        } catch (error) {
          console.error("Error fetching blog articles:", error);
          let errorMessage = "Failed to load blog articles";

          if (error && typeof error === "object" && "response" in error) {
            const errorResponse = error.response as ErrorResponse;
            if (errorResponse?.data?.message) {
              errorMessage = errorResponse.data.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            blogArticlesError: errorMessage,
            isLoadingBlogArticles: false,
          });
        }
      },

      fetchBlogArticleDetails: async (idOrSlug: string | number) => {
        try {
          set({
            isLoadingBlogArticleDetails: true,
            blogArticleDetailsError: null,
          });

          const response = await axiosInstance.get<BlogArticleDetails>(
            `/api/articles/show/${idOrSlug}`,
            {
              withCredentials: true,
            },
          );

          set({
            blogArticleDetails: response.data,
            isLoadingBlogArticleDetails: false,
            blogArticleDetailsError: null,
          });
        } catch (error) {
          console.error("Error fetching blog article details:", error);
          let errorMessage = "Failed to load article details";

          if (error && typeof error === "object" && "response" in error) {
            const errorResponse = error.response as ErrorResponse;
            if (errorResponse?.data?.message) {
              errorMessage = errorResponse.data.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            blogArticleDetailsError: errorMessage,
            isLoadingBlogArticleDetails: false,
          });
        }
      },

      toggleRead: async (articleId: number) => {
        try {
          const currentArticles = get().blogArticles;
          if (currentArticles) {
            const updatedArticles = {
              ...currentArticles,
              data: currentArticles.data.map((article) => {
                if (article.id === articleId) {
                  return {
                    ...article,
                    read: article.read > 0 ? 0 : 1,
                  };
                }
                return article;
              }),
            };
            set({ blogArticles: updatedArticles });
          }

          const currentArticleDetails = get().blogArticleDetails;
          if (currentArticleDetails && currentArticleDetails.id === articleId) {
            set({
              blogArticleDetails: {
                ...currentArticleDetails,
                read: currentArticleDetails.read > 0 ? 0 : 1,
              },
            });
          }

          await axiosInstance.post(`/api/articles/read/${articleId}`);

          return true;
        } catch (error) {
          console.error("Error toggling read status:", error);

          const currentArticles = get().blogArticles;
          if (currentArticles) {
            const revertedArticles = {
              ...currentArticles,
              data: currentArticles.data.map((article) => {
                if (article.id === articleId) {
                  return {
                    ...article,
                    read: article.read > 0 ? 0 : 1,
                  };
                }
                return article;
              }),
            };
            set({ blogArticles: revertedArticles });
          }

          const currentArticleDetails = get().blogArticleDetails;
          if (currentArticleDetails && currentArticleDetails.id === articleId) {
            set({
              blogArticleDetails: {
                ...currentArticleDetails,
                read: currentArticleDetails.read > 0 ? 0 : 1,
              },
            });
          }

          return false;
        }
      },

      fetchProductCategories: async () => {
        try {
          set({
            isLoadingProductCategories: true,
            productCategoriesError: null,
          });

          const response = await axiosInstance.get<ProductCategoryResponse>(
            "/api/product-categories",
          );

          const sortedCategories = response.data.sort(
            (a, b) => a.sort - b.sort,
          );

          set({
            productCategories: sortedCategories,
            isLoadingProductCategories: false,
            productCategoriesError: null,
          });
        } catch (error) {
          console.error("Error fetching product categories:", error);
          let errorMessage = "Failed to load product categories";

          if (error && typeof error === "object" && "response" in error) {
            const errorResponse = error.response as ErrorResponse;
            if (errorResponse?.data?.message) {
              errorMessage = errorResponse.data.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            productCategoriesError: errorMessage,
            isLoadingProductCategories: false,
          });
        }
      },

      fetchProducts: async (params?: ProductsParams) => {
        try {
          set({ isLoadingProducts: true, productsError: null });

          const queryParams = new URLSearchParams();
          if (params) {
            if (params.page) queryParams.append("page", params.page.toString());
            if (params.product_category_id)
              queryParams.append(
                "product_category_id",
                params.product_category_id.toString(),
              );
            if (params.search) queryParams.append("search", params.search);
            if (params.sorting)
              queryParams.append("sorting", params.sorting.toString());
          }

          const queryString = queryParams.toString();
          const url = `/api/products${queryString ? `?${queryString}` : ""}`;

          const response = await axiosInstance.get<ProductsResponse>(url);

          set({
            products: response.data,
            isLoadingProducts: false,
            productsError: null,
          });
        } catch (error) {
          console.error("Error fetching products:", error);
          let errorMessage = "Failed to load products";

          if (error && typeof error === "object" && "response" in error) {
            const errorResponse = error.response as ErrorResponse;
            if (errorResponse?.data?.message) {
              errorMessage = errorResponse.data.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            productsError: errorMessage,
            isLoadingProducts: false,
          });
        }
      },

      fetchProductDetails: async (idOrSlug: string | number) => {
        try {
          set({
            isLoadingProductDetails: true,
            productDetailsError: null,
          });

          const response = await axiosInstance.get<ProductDetails>(
            `/api/products/show/${idOrSlug}`,
            {
              withCredentials: true,
            },
          );

          set({
            productDetails: response.data,
            isLoadingProductDetails: false,
            productDetailsError: null,
          });
        } catch (error) {
          console.error("Error fetching product details:", error);
          let errorMessage = "Failed to load product details";

          if (error && typeof error === "object" && "response" in error) {
            const errorResponse = error.response as ErrorResponse;
            if (errorResponse?.status === 404) {
              errorMessage = "Product not found";
            } else if (errorResponse?.data?.message) {
              errorMessage = errorResponse.data.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            productDetailsError: errorMessage,
            isLoadingProductDetails: false,
          });
        }
      },

      createOrder: async (params: OrderCreateParams) => {
        try {
          set({
            isCreatingOrder: true,
            orderCreateSuccess: null,
            orderCreateError: null,
          });

          const response = await axiosInstance.post<OrderCreateResponse>(
            "/api/orders/store",
            params,
            {
              withCredentials: true,
            },
          );

          if (response.data.type === "success") {
            set({
              isCreatingOrder: false,
              orderCreateSuccess: response.data.status,
              orderCreateError: null,
            });
            return true;
          }

          set({
            isCreatingOrder: false,
            orderCreateSuccess: null,
            orderCreateError: "An unexpected error occurred",
          });
          return false;
        } catch (error) {
          console.error("Error creating order:", error);
          let errorMessage = "Failed to create order";

          if (error && typeof error === "object" && "response" in error) {
            const errorResponse = error.response as ErrorResponse;
            if (errorResponse?.status === 422) {
              if (errorResponse.data?.message) {
                errorMessage = errorResponse.data.message;
              } else if (errorResponse.data?.errors) {
                const errors = Object.values(errorResponse.data.errors).flat();
                errorMessage = errors.join(", ");
              }
            } else if (errorResponse?.data?.message) {
              errorMessage = errorResponse.data.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            isCreatingOrder: false,
            orderCreateSuccess: null,
            orderCreateError: errorMessage,
          });
          return false;
        }
      },

      resetOrderState: () => {
        set({
          isCreatingOrder: false,
          orderCreateSuccess: null,
          orderCreateError: null,
        });
      },

      fetchSubaccounts: async (page?: number) => {
        try {
          set({ isLoadingSubaccounts: true, subaccountsError: null });

          const queryParams = new URLSearchParams();
          if (page) queryParams.append("page", page.toString());

          const queryString = queryParams.toString();
          const url = `/api/user/subaccounts${
            queryString ? `?${queryString}` : ""
          }`;

          const response = await axiosInstance.get<SubaccountsResponse>(url);

          set({
            subaccounts: response.data,
            isLoadingSubaccounts: false,
            subaccountsError: null,
          });
        } catch (error) {
          console.error("Error fetching subaccounts:", error);
          let errorMessage = "Failed to load subaccounts";

          if (error && typeof error === "object" && "response" in error) {
            const errorResponse = error.response as ErrorResponse;
            if (errorResponse?.data?.message) {
              errorMessage = errorResponse.data.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            subaccountsError: errorMessage,
            isLoadingSubaccounts: false,
          });
        }
      },

      setAuthStatus: (status: string | null) => {
        set({ authStatus: status });
      },

      login: async (data: LoginParams) => {
        set({ authErrors: {}, authLoading: true });
        try {
          const response = await axiosInstance.post<{
            token: string;
          }>("/api/login", data);
          const token = response.data?.token;
          if (token) {
            Cookies.set("auth-token", token, {
              expires: 7,
              secure: true,
              sameSite: "Strict",
            });
            updateAxiosToken(token);
          }

          try {
            const { data: userData } = await axiosInstance.get<User>(
              "/api/user",
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );
            set({ user: userData, sessionVerified: true });
          } catch (userError) {
            console.warn("Error fetching user after login:", userError);
            set({ sessionVerified: false, user: null });
            updateAxiosToken(null);
            Cookies.remove("auth-token");
          }

          set({ authLoading: false });
          return response.data;
        } catch (e) {
          const err = e as {
            response?: { data?: { errors?: AuthErrors } };
          };
          set({
            authErrors: err.response?.data?.errors || {},
            authLoading: false,
          });
          throw e;
        }
      },

      register: async (data: RegisterParams) => {
        set({ authErrors: {}, authLoading: true });
        try {
          const response = await axiosInstance.post<{
            token: string;
          }>("/api/register", data);
          const token = response.data?.token;
          if (token) {
            Cookies.set("auth-token", token, {
              expires: 7,
              secure: true,
              sameSite: "Strict",
            });
            updateAxiosToken(token);
          }

          try {
            const { data: userData } = await axiosInstance.get<User>(
              "/api/user",
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );
            set({ user: userData, sessionVerified: true });
          } catch (userError) {
            console.warn("Error fetching user after registration:", userError);
            set({ sessionVerified: false, user: null });
          }

          set({ authLoading: false });
          return response.data;
        } catch (e) {
          const err = e as {
            response?: { data?: { errors?: AuthErrors } };
          };
          set({
            authErrors: err.response?.data?.errors || {},
            authLoading: false,
          });
          throw e;
        }
      },

      logout: async () => {
        set({ authLoading: true });
        try {
          await axiosInstance.post("/api/logout");
          updateAxiosToken(null);
          Cookies.remove("auth-token");
          Cookies.remove("user");
          set({
            user: null,
            sessionVerified: false,
            authLoading: false,
          });
        } catch (e) {
          console.error("Logout error:", e);
          set({ authLoading: false });
          throw e;
        }
      },

      sendPasswordResetLink: async (data: { email: string }) => {
        set({ authErrors: {}, authLoading: true, authStatus: null });
        try {
          const response = await axiosInstance.post<{
            status: string;
          }>("/api/forgot-password", data);
          set({
            authStatus: response.data?.status,
            authLoading: false,
          });
          return response.data;
        } catch (e) {
          const err = e as {
            response?: { data?: { errors?: AuthErrors } };
          };
          set({
            authErrors: err.response?.data?.errors || {},
            authLoading: false,
          });
          throw e;
        }
      },

      newPassword: async (data: NewPasswordParams) => {
        set({ authErrors: {}, authLoading: true, authStatus: null });
        try {
          const response = await axiosInstance.post<{
            status: string;
          }>("/api/reset-password", data);
          set({
            authStatus: response.data?.status,
            authLoading: false,
          });
          return response.data;
        } catch (e) {
          set({ authLoading: false });
          throw e;
        }
      },

      sendEmailVerificationLink: async () => {
        set({ authErrors: {}, authLoading: true, authStatus: null });
        try {
          const response = await axiosInstance.post<{
            status: string;
          }>("/api/email/verification-notification");
          set({
            authStatus: response.data?.status,
            authLoading: false,
          });
          return response.data;
        } catch (e) {
          set({ authLoading: false });
          throw e;
        }
      },

      fetchNotifications: async (page?: number) => {
        try {
          set({
            isLoadingNotifications: true,
            notificationsError: null,
          });

          const queryParams = new URLSearchParams();
          if (page) queryParams.append("page", page.toString());

          const queryString = queryParams.toString();
          const url = `/api/notifications${
            queryString ? `?${queryString}` : ""
          }`;

          const response = await axiosInstance.get<NotificationsResponse>(url);

          set({
            notifications: response.data,
            isLoadingNotifications: false,
            notificationsError: null,
          });
        } catch (error) {
          console.error("Error fetching notifications:", error);
          let errorMessage = "Failed to load notifications";

          if (error && typeof error === "object" && "response" in error) {
            const errorResponse = error.response as ErrorResponse;
            if (errorResponse?.data?.message) {
              errorMessage = errorResponse.data.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            notificationsError: errorMessage,
            isLoadingNotifications: false,
          });
        }
      },
    }),
    {
      name: "drophunting-store",
      partialize: (state) => ({
        selectedTimezone: state.selectedTimezone,
        coupon: state.coupon,
        user: state.user,
        sessionVerified: state.sessionVerified,
      }),
    },
  ),
);

export default useStore;
