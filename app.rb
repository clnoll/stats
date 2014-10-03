require 'sinatra'
require_relative 'lib/renzu.rb'

# class Renzu::App < Sinatra::Application
#   configure :development do |c|
#     c.set :bind, '10.10.10.10'
#   end

  # set :bind, '10.10.10.10'

  get '/' do
    send_file 'index.html'
  end
# end
